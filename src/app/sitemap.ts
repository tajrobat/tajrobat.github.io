import { MetadataRoute } from "next";
import { getAllCompanies } from "@/data/companies";
import { getAllReviewIds } from "@/data/reviews";
import * as fs from "fs";
import * as path from "path";

const URLS_PER_SITEMAP = 1000;
export const dynamic = "force-static";

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

function generateSitemapXML(urls: MetadataRoute.Sitemap) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (entry) => `
        <url>
          <loc>${entry.url}</loc>
          <lastmod>${entry.lastModified}</lastmod>
          ${
            entry.changeFrequency
              ? `<changefreq>${entry.changeFrequency}</changefreq>`
              : ""
          }
          ${entry.priority ? `<priority>${entry.priority}</priority>` : ""}
        </url>
      `
        )
        .join("")}
    </urlset>`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://tajrobat.github.io";
  const lastModified = new Date().toISOString();

  const staticUrls = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  let companies: { slug: string | null; id: number }[] = [];
  try {
    companies = getAllCompanies();
  } catch (error) {
    console.error("Error fetching companies:", error);
    companies = [];
  }

  const companyUrls = companies.map((company) => ({
    url: `${baseUrl}/company/${company.slug ?? company.id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let reviewIds: (string | number)[] = [];
  try {
    reviewIds = await getAllReviewIds();
  } catch (error) {
    console.error("Error fetching review IDs:", error);
    reviewIds = [];
  }

  const reviewUrls = reviewIds.map((id) => ({
    url: `${baseUrl}/review/${id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const allUrls = [...staticUrls, ...companyUrls, ...reviewUrls];

  if (allUrls.length > URLS_PER_SITEMAP) {
    const chunks = chunkArray(allUrls, URLS_PER_SITEMAP);

    // Generate individual sitemap files
    chunks.forEach((chunk, index) => {
      const xml = generateSitemapXML(chunk);
      const filePath = path.join(
        process.cwd(),
        "public",
        `sitemap-${index + 1}.xml`
      );
      fs.writeFileSync(filePath, xml);
    });

    // Generate sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${chunks
          .map(
            (_, index) => `
          <sitemap>
            <loc>${baseUrl}/sitemap-${index + 1}.xml</loc>
            <lastmod>${lastModified}</lastmod>
          </sitemap>
        `
          )
          .join("")}
      </sitemapindex>`;

    fs.writeFileSync(
      path.join(process.cwd(), "public", "sitemap.xml"),
      sitemapIndex
    );

    // Return the sitemap index entries for Next.js
    return chunks.map((_, index) => ({
      url: `${baseUrl}/sitemap-${index + 1}.xml`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  }

  // If we don't need to chunk, just generate a single sitemap file
  const xml = generateSitemapXML(allUrls);
  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), xml);
  return allUrls;
}
