import { MetadataRoute } from "next";
import { getAllCompanies } from "@/data/companies";

const URLS_PER_SITEMAP = 1000;
export const dynamic = "force-static";

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://tajrobat.github.io";
  const companiesLastMod = "2024-03-20";

  let slugs: string[] = [];
  try {
    slugs = getAllCompanies().map((company) => company.slug);
  } catch (error) {
    console.error("Error fetching company slugs:", error);
    slugs = [];
  }

  const companyUrls = slugs.map((slug) => ({
    url: `${baseUrl}/company/${slug}`,
    lastModified: companiesLastMod,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const baseUrls = [
    {
      url: baseUrl,
      lastModified: "2024-03-20",
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2024-03-20",
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: "2024-03-20",
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  if (companyUrls.length > URLS_PER_SITEMAP) {
    const chunkedCompanyUrls = chunkArray(companyUrls, URLS_PER_SITEMAP);

    return [
      ...baseUrls,
      ...chunkedCompanyUrls.map((_, index) => ({
        url: `${baseUrl}/sitemap-companies-${index + 1}.xml`,
        lastModified: companiesLastMod,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  }

  return [...baseUrls, ...companyUrls];
}
