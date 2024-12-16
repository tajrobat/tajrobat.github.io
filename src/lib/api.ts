import { companies } from "@/data/companies";
import { Review } from "@/app/types";

export function getCompanyData(slug: string) {
  return companies.find(
    (company) => company.slug === slug || company.id.toString() === slug
  );
}

export function getReviewData(id: string): Review | undefined {
  for (const company of companies) {
    const review = company.reviews?.find((r) => r.id.toString() === id);
    if (review) {
      return {
        ...review,
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
        },
      };
    }
  }
}
