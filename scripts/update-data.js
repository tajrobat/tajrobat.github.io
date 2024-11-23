import { promises as fs } from 'fs';
import axios from 'axios';
import pLimit from 'p-limit';
import { backOff } from 'exponential-backoff';
import ora from 'ora';
import chalk from 'chalk';
import cliProgress from 'cli-progress';

// Constants
const API_BASE_URL = 'https://api.tajrobe.wiki/api/client';
const CONCURRENT_REQUESTS = 1; // Limit concurrent requests
const BATCH_SIZE = 50; // Smaller batch size for better control
const BASE_DELAY = 5000; // Increased base delay
const MAX_RETRIES = 5; // Increased retries

// Rate limiter setup
const limiter = pLimit(CONCURRENT_REQUESTS);

// API client with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
});

// Add retry logic with exponential backoff
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 429) { // Rate limit exceeded
    const retryAfter = error.response.headers['retry-after'] || 5;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return api.request(error.config);
  }
  return Promise.reject(error);
});

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Chunking helper
const chunk = (arr, size) => 
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

async function fetchWithRetry(requestFn) {
  return backOff(() => requestFn(), {
    numOfAttempts: MAX_RETRIES,
    startingDelay: BASE_DELAY,
    maxDelay: 10000,
  });
}

// Add backup functionality
async function backupData(data) {
  // Create backups directory if it doesn't exist
  const backupsDir = 'backups';
  await fs.mkdir(backupsDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${backupsDir}/data-backup-${timestamp}.json`;
  await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
  return backupPath;
}

// Add new function to get all existing review IDs
async function getExistingReviewIds(existingData) {
  const reviewIds = new Set();
  existingData.forEach(company => {
    company.reviews.forEach(review => {
      reviewIds.add(review.id);
    });
  });
  return reviewIds;
}

// Add progress bar formatting
const progressBar = new cliProgress.MultiBar({
  format: '{bar} {percentage}% | {value}/{total} Reviews | Batch {batch} | {status}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  clearOnComplete: false,
  hideCursor: true,
  fps: 5
}, cliProgress.Presets.shades_classic);

async function updateData() {
  const spinner = ora();
  try {
    console.log(chalk.blue.bold('\n🚀 Starting data update process...\n'));
    
    // Loading existing data
    spinner.start('Loading existing data...');
    let existingData = [];
    try {
      const rawData = await fs.readFile('data.json', 'utf8');
      existingData = JSON.parse(rawData);
      
      if (!Array.isArray(existingData)) {
        spinner.fail('Invalid data.json format - expected array');
        throw new Error('Invalid data format');
      }

      const backupPath = await backupData(existingData);
      spinner.succeed(`Loaded existing data and created backup at ${chalk.cyan(backupPath)}`);

    } catch (error) {
      if (error.code === 'ENOENT') {
        spinner.info('No existing data.json found, starting fresh');
        existingData = [];
      } else {
        spinner.fail('Critical error reading data.json');
        throw error;
      }
    }

    // Get existing review IDs
    spinner.start('Analyzing existing reviews...');
    const existingReviewIds = await getExistingReviewIds(existingData);
    spinner.succeed(`Found ${chalk.green(existingReviewIds.size)} existing reviews`);

    // Get latest review from API
    spinner.start('Fetching latest review ID from API...');
    const latestReviewResponse = await api.get('/review', {
      params: { page: 1, per_page: 1 }
    });
    const latestReviewId = latestReviewResponse.data.data.data?.[0]?.id;
    spinner.succeed(`Latest review ID from API: ${chalk.green(latestReviewId)}`);

    // Calculate missing reviews
    const allReviewIds = Array.from(
      { length: latestReviewId },
      (_, i) => i + 1
    ).filter(id => !existingReviewIds.has(id));

    if (allReviewIds.length === 0) {
      console.log(chalk.green.bold('\n✨ Database is already up to date!\n'));
      return;
    }

    console.log(chalk.yellow(`\n📥 Found ${chalk.bold(allReviewIds.length)} reviews to process\n`));

    // Setup progress bars
    const batchBar = progressBar.create(100, 0, { batch: 'N/A', status: 'Starting...' });
    const totalBar = progressBar.create(allReviewIds.length, 0, { batch: 'Total', status: 'In Progress' });

    // Process reviews in batches
    const reviewBatches = chunk(allReviewIds, BATCH_SIZE);
    
    for (const [batchIndex, batch] of reviewBatches.entries()) {
      const batchNumber = `${batchIndex + 1}/${reviewBatches.length}`;
      batchBar.update(0, { batch: batchNumber, status: 'Fetching...' });

      // Process batch
      const reviewPromises = batch.map((reviewId, index) =>
        limiter(async () => {
          const result = await fetchWithRetry(() =>
            api.get(`/review/${reviewId}`)
              .then(response => response.data.data)
              .catch(error => {
                if (error.response?.status !== 404) {
                  console.log(chalk.red(`\n⚠️ Error fetching review ${reviewId}: ${error.message}`));
                }
                return null;
              })
          );
          batchBar.update((index + 1) / batch.length * 100);
          totalBar.increment(1);
          return result;
        })
      );

      const reviews = await Promise.all(reviewPromises);
      
      // Process valid reviews
      const validReviews = reviews.filter(Boolean);
      if (validReviews.length > 0) {
        batchBar.update(100, { status: 'Saving...' });
        // Group reviews by company_id for efficient updates
        const reviewsByCompany = validReviews.reduce((acc, review) => {
          if (!acc[review.company_id]) acc[review.company_id] = [];
          acc[review.company_id].push(review);
          return acc;
        }, {});

        // Bulk update companies
        for (const [companyId, companyReviews] of Object.entries(reviewsByCompany)) {
          const company = existingData.find(c => c.id === parseInt(companyId));
          if (company) {
            company.reviews.push(...companyReviews.map(review => ({
              _id: { $oid: new Date().getTime().toString(16) },
              id: review.id,
              answer: review.answer,
              approved_by: review.approved_by,
              company: JSON.stringify(review.company),
              company_id: review.company_id,
              createdAt: { $date: new Date().toISOString() },
              created_at: review.created_at,
              description: review.description,
              job_title: review.job_title,
              rate: review.rate,
              review_status: review.review_status,
              review_type: review.review_type,
              salary: review.salary,
              sexual_harassment: review.sexual_harassment,
              start_date: review.start_date,
              status: "PUBLISH",
              title: review.title,
              updatedAt: { $date: new Date().toISOString() },
              updated_at: review.updated_at,
              _meta: {
                importedAt: new Date().toISOString(),
                version: '1.0'
              }
            })));
          }
        }

        // Safe file writing with temporary file
        try {
          const tempFile = 'data.json.temp';
          await fs.writeFile(tempFile, JSON.stringify(existingData, null, 2));
          await fs.rename(tempFile, 'data.json');
          console.log(chalk.green(`Processed ${validReviews.length} reviews and saved successfully`));
        } catch (error) {
          console.error('Error saving updates:', error);
          console.log('Original data.json remains unchanged');
          throw error;
        }

        // Update progress
        const processedCount = (batchIndex + 1) * BATCH_SIZE;
        totalBar.update(processedCount, { 
          status: `Saved ${chalk.green(validReviews.length)} new reviews` 
        });
      }

      // Save batch progress
      await fs.writeFile('progress.json', JSON.stringify({
        lastProcessedBatch: batchIndex,
        totalBatches: reviewBatches.length,
        processedReviews: (batchIndex + 1) * BATCH_SIZE,
        totalReviews: allReviewIds.length,
        lastUpdate: new Date().toISOString()
      }, null, 2));

      await delay(BASE_DELAY);
    }

    progressBar.stop();
    console.log(chalk.green.bold('\n✨ Data update completed successfully!\n'));

  } catch (error) {
    spinner.fail('Error updating data');
    console.error(chalk.red('\n❌ Error:'), error.message);
    console.log(chalk.yellow('Original data.json remains unchanged'));
    progressBar.stop();
    process.exit(1);
  }
}

// Add error handling for the main execution
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

updateData().catch(console.error);
