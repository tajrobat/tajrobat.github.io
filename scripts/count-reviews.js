import { readFileSync } from 'fs';

// Read data from JSON file
const data = JSON.parse(readFileSync('data.json', 'utf8'));

// Simple count of all reviews
const totalReviews = data.reduce((sum, company) => {
    return sum + (company.reviews?.length || 0);
}, 0);

console.log('Total number of reviews:', totalReviews); 