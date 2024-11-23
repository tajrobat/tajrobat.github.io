import companiesData from "../../cached-companies.json";
import { Company } from "@/app/types";

export const companies: Company[] = companiesData as Company[];

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((company) => company.slug === slug);
}

export function getAllCompanies(): Company[] {
  return companies;
}
