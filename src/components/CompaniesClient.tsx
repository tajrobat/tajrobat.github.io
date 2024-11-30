"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CompanyCard from "./CompanyCard";
import SearchBar from "./SearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import debounce from "lodash/debounce";
import { Company } from "@/app/types/index";

const ITEMS_PER_PAGE = 32;

const sortOptions = [
  {
    value: "reviews-desc",
    label: "بیشترین نظرات",
    sortFn: (a: Company, b: Company) =>
      (b.reviews?.length || 0) - (a.reviews?.length || 0),
  },
  {
    value: "rating-desc",
    label: "بالاترین امتیاز",
    sortFn: (a: Company, b: Company) => (b.rate || 0) - (a.rate || 0),
  },
  {
    value: "rating-asc",
    label: "پایین‌ترین امتیاز",
    sortFn: (a: Company, b: Company) => (a.rate || 0) - (b.rate || 0),
  },
  {
    value: "salary-desc",
    label: "بالاترین حقوق",
    sortFn: (a: Company, b: Company) =>
      (b.salary_max || 0) - (a.salary_max || 0),
  },
  {
    value: "newest",
    label: "جدیدترین",
    sortFn: (a: Company, b: Company) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  },
];

// Pre-sort companies by default sort
const getInitialSortedCompanies = (companies: Company[]) => {
  const defaultSort = sortOptions.find((opt) => opt.value === "reviews-desc");
  return [...companies].sort(defaultSort?.sortFn);
};

export default function CompaniesClient({
  companies,
}: {
  companies: Company[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize with URL params or defaults
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "reviews-desc"
  );
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );
  const [searchResults, setSearchResults] = useState<Company[]>(() =>
    getInitialSortedCompanies(companies)
  );

  const updateURLParams = useCallback(
    (params: { [key: string]: string }) => {
      const newSearchParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const normalizedQuery = query.toLowerCase().trim();
      let filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(normalizedQuery) ||
          company.description.toLowerCase().includes(normalizedQuery)
      );

      const selectedSort = sortOptions.find((opt) => opt.value === sortBy);
      if (selectedSort) {
        filtered = [...filtered].sort(selectedSort.sortFn);
      }

      setSearchResults(filtered);
      setCurrentPage(1);
    }, 300),
    [sortBy, companies]
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateURLParams({ search: value, page: "1" });
    debouncedSearch(value);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    updateURLParams({ sort: value, page: "1" });
    const selectedSort = sortOptions.find((opt) => opt.value === value);
    if (selectedSort) {
      setSearchResults((prev) => [...prev].sort(selectedSort.sortFn));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCompanies = searchResults.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center h-[80px]">
        <div className="w-full sm:w-96">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="جستجو در شرکت‌ها..."
          />
        </div>

        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="مرتب‌سازی بر اساس" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[400px]">
        {currentCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {searchResults.length === 0 ? (
        <div className="text-center py-12 min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">هیچ شرکتی یافت نشد.</p>
        </div>
      ) : (
        <div className="flex justify-center mt-8 h-[48px]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-label="قبلی"
                  href="#"
                  size="default"
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    handlePageChange(newPage);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                >
                  قبلی
                </PaginationPrevious>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;

                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  pageNumber === currentPage ||
                  pageNumber === currentPage - 1 ||
                  pageNumber === currentPage + 1
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        size="default"
                        href="#"
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber.toLocaleString("fa-IR")}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 &&
                    currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  size="default"
                  href="#"
                  onClick={() => {
                    const newPage = Math.min(totalPages, currentPage + 1);
                    handlePageChange(newPage);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  بعدی
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
