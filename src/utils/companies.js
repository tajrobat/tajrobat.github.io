import fs from "fs";
import path from "path";
import "dotenv/config";


export async function fetchAndCacheCompanies() {
  console.log("Starting to fetch companies...");
  let allCompanies = [];
  let currentPage = 1;
  let hasMorePages = true;
  const filePath = path.join(process.cwd(), "cached-companies.json");

  // Initialize empty array in file if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }

  while (hasMorePages) {
    console.log(`Fetching page ${currentPage}...`);
    const response = await fetch(
      `${process.env.API_URL}/companies?page=${currentPage}`
    );
    const data = await response.json();

    const { companies, totalPages } = data;
    console.log(
      `Retrieved ${companies.length} companies from page ${currentPage}/${totalPages}`
    );

    // Add new companies to our running total
    allCompanies = [...allCompanies, ...companies];

    // Read existing data, append new companies, and write back to file
    console.log(`Updating cache file with page ${currentPage} data...`);
    fs.writeFileSync(filePath, JSON.stringify(allCompanies, null, 2));
    console.log(`Cache updated with ${allCompanies.length} total companies`);

    hasMorePages = currentPage < totalPages;
    currentPage++;
  }

  console.log("All companies successfully cached");
  return allCompanies;
}
