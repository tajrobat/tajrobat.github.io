"use client";

import { useState, useCallback, useEffect } from "react";
import CompanyCard from "@/components/CompanyCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBar from "@/components/SearchBar";
import debounce from "lodash/debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import ArchiveNotice from "@/components/ArchiveNotice";
import { Company } from "@/app/types";

const ITEMS_PER_PAGE = 32;

type SortOption = {
  value: string;
  label: string;
  sortFn: (a: any, b: any) => number;
};

const sortOptions: SortOption[] = [
  {
    value: "reviews-desc",
    label: "بیشترین نظرات",
    sortFn: (a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0),
  },
  {
    value: "rating-desc",
    label: "بالاترین امتیاز",
    sortFn: (a, b) => (b.rate || 0) - (a.rate || 0),
  },
  {
    value: "rating-asc",
    label: "پایین‌ترین امتیاز",
    sortFn: (a, b) => (a.rate || 0) - (b.rate || 0),
  },
  {
    value: "salary-desc",
    label: "بالاترین حقوق",
    sortFn: (a, b) => (b.salary_max || 0) - (a.salary_max || 0),
  },
  {
    value: "newest",
    label: "جدیدترین",
    sortFn: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  },
];

export const HomeClient = ({ companies }: { companies: Company[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || ""
  );
  const [searchResults, setSearchResults] = useState<typeof companies>([]);
  const [isClient, setIsClient] = useState(false);
  const [sortBy, setSortBy] = useState<string>(
    () => searchParams.get("sort") || "reviews-desc"
  );

  const getTotalReviews = () => {
    return companies.reduce(
      (total, company) => total + (company.reviews?.length || 0),
      0
    );
  };

  useEffect(() => {
    setIsClient(true);
    const defaultSort = sortOptions.find((opt) => opt.value === "reviews-desc");
    if (defaultSort) {
      setSearchResults([...companies].sort(defaultSort.sortFn));
    } else {
      setSearchResults(companies);
    }
  }, []);

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
    [sortBy]
  );

  const updateURL = useCallback(
    (page: number, query: string, sort: string) => {
      const params = new URLSearchParams();
      if (page > 1) params.set("page", page.toString());
      if (query) params.set("q", query);
      if (sort !== "reviews-desc") params.set("sort", sort);

      const newURL = `${window.location.pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;
      router.push(newURL);
    },
    [router]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateURL(1, query, sortBy);
    debouncedSearch(query);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL(currentPage, searchQuery, value);
    const selectedSort = sortOptions.find((opt) => opt.value === value);
    if (selectedSort) {
      setSearchResults((prev) => [...prev].sort(selectedSort.sortFn));
    }
  };

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCompanies = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateURL(pageNumber, searchQuery, sortBy);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      <div className="absolute inset-0 bg-center" />
      {/* <Header /> */}

      <div className="relative container mx-auto px-4 py-8">
        <ArchiveNotice />
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-orange-500 pt-2">
            تَجرُبَت
          </h1>
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              {getTotalReviews().toLocaleString("fa-IR")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-full">
              تجربه ثبت شده
            </div>
          </div>
          <h6 className="text-gray-500 text-md font-bold">
            تجربه را تجربه کردن خطاست!
          </h6>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="جستجو در شرکت‌ها..."
          />
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            نتیجه‌ای یافت نشد
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 p-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                لیست شرکت ها {searchQuery && `(${searchResults.length} نتیجه)`}
              </h2>

              <Select value={sortBy} onValueChange={handleSortChange}>
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

            <div className="flex flex-wrap justify-center">
              {currentCompanies.map((company) => (
                <div
                  key={company.id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                >
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-label="قبی"
                      href="#"
                      size="default"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
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
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
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
          </>
        )}
      </div>
    </main>
  );
};
