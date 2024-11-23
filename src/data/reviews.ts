import { Review } from "@/app/types";
import { companies } from "./companies";

export async function getReviewById(
  id: string | number
): Promise<Review | null> {
  for (const company of companies) {
    const review = company.reviews.find((r) => r.id === id);
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
  return null;
}

export async function getAllReviewIds(): Promise<string[]> {
  const reviewIds: string[] = [];
  for (const company of companies) {
    for (const review of company.reviews) {
      reviewIds.push(review.id.toString());
    }
  }
  return reviewIds;
}
