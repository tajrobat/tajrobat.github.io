import React from "react";
import { Company } from "@/app/types";
import Link from "next/link";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const companyUrl = company.slug
    ? `/company/${company.slug}`
    : `/company/id/${company.id}`;

  return (
    <Link href={companyUrl}>
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {company.name}
          </h3>
          {company.rate > 0 && (
            <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded shrink-0">
              <span className="text-orange-600 dark:text-orange-300 text-sm font-medium">
                {company.rate.toLocaleString("fa-IR", {
                  maximumFractionDigits: 1,
                })}
              </span>
              <svg
                className="w-4 h-4 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 pt-2">
          {company.description}
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          {company.reviews?.length > 0 && (
            <span className="inline-flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
              {company.reviews.length.toLocaleString("fa-IR")} نظر
            </span>
          )}

          {(company.salary_min > 0 || company.salary_max > 0) && (
            <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded">
              {company.salary_min > 0
                ? company.salary_min.toLocaleString("fa-IR")
                : "۰"}
              -
              {company.salary_max > 0
                ? company.salary_max.toLocaleString("fa-IR")
                : "۰"}{" "}
              میلیون
            </span>
          )}

          {company.verified === 1 && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              تایید شده
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {company.badges?.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
            مشاهده جزییات
          </div>
        </div>
      </div>
    </Link>
  );
}
