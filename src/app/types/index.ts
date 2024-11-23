export interface Review {
  id: number;
  title: string;
  description: string;
  rate: number;
  review_type: "REVIEW" | "INTERVIEW";
  review_status: string;
  created_at: string;
  salary?: number;
  job_title?: string;
  company: Partial<Company>;
}

export interface Company {
  id: number;
  slug: string;
  name: string;
  description: string;
  site?: string;
  rate: number;
  review_average: number;
  interview_average: number;
  total_review: number;
  total_interview: number;
  salary_min: number;
  salary_max: number;
  verified: number;
  reviews: Review[];
}
