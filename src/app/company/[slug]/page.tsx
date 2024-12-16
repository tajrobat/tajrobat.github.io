import { getAllCompanies, getCompanyBySlug } from "@/data/companies";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, Briefcase, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { generateCompanyMetadata } from "@/app/metadata";
import { CompanyJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Review } from "@/app/types/index";

export function generateStaticParams() {
  const companies = getAllCompanies();
  return companies.map((company) => ({
    slug: company.slug ? String(company.slug) : String(company.id),
  }));
}

// Helper function to convert numbers to Persian digits
const toPersianNumbers = (num: number): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => persianDigits[parseInt(x)]);
};

const formatSalary = (value: number) => {
  if (value <= 0) return "مشخص نیست";

  const persianNumber = toPersianNumbers(value);

  const withSeparator = persianNumber
    .split("")
    .reverse()
    .reduce((acc, digit, i) => {
      if (i > 0 && i % 3 === 0) {
        return digit + "," + acc;
      }
      return digit + acc;
    }, "");

  return `${withSeparator} میلیون`;
};

// Helper function to format number
const formatNumber = (value: number) => {
  if (value <= 0) return "مشخص نیست";
  return toPersianNumbers(parseFloat(value.toFixed(1)));
};

// Update the formatDate function to handle ISO date strings
const formatDate = (dateString: string) => {
  try {
    // Handle both ISO date strings and regular date strings
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    const formatter = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric", // Add day to show full date
    });

    return formatter.format(date);
  } catch {
    return null;
  }
};

// Update the filterReviews function
const filterReviews = (reviews: Review[], type: string) => {
  // Sort reviews by ISO date in descending order
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB.getTime() - dateA.getTime();
  });

  // Then apply the type filter
  switch (type) {
    case "working":
      return sortedReviews.filter(
        (review) => review.review_status === "NOT_WORKING"
      );
    case "interview":
      return sortedReviews.filter(
        (review) => review.review_status !== "NOT_WORKING"
      );
    case "salary":
      return sortedReviews.filter(
        (review) => review.salary && review.salary > 0 && review.job_title
      );
    default:
      return sortedReviews;
  }
};

export default async function CompanyPage({
  params,
}: {
  params: { slug: string };
}) {
  // Await the params if it's a Promise
  const actualParams = await params;

  const company = await getCompanyBySlug(actualParams.slug);

  if (!company) {
    notFound();
  }

  // Define stats data
  const statsData = [
    {
      label: "میانگین نظرات",
      value: formatNumber(company.review_average),
      icon: Star,
    },
    {
      label: "تعداد نظرات",
      value: company.reviews?.length
        ? toPersianNumbers(company.reviews.length)
        : "مشخص نیست",
      icon: Users,
    },
    {
      label: "ح��اقل حقوق",
      value: formatSalary(company.salary_min),
      icon: Briefcase,
    },
    {
      label: "حداکثر حقوق",
      value: formatSalary(company.salary_max),
      icon: Briefcase,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <CompanyJsonLd company={company} />
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* <ArchiveNotice /> */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {company.name}
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Badge variant="secondary" className="text-sm">
                {company.total_review > 0
                  ? `${toPersianNumbers(company.total_review)} نظر`
                  : "بدون نظر"}
              </Badge>
              {company.rate > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">
                    {toPersianNumbers(company.rate)}
                  </span>
                </div>
              )}
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {company.description || "توضیحات موجود نیست"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reviews Grid */}
        <section className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">نظرات کاربران</h2>
          </div>

          {company.reviews && company.reviews.length > 0 ? (
            <Tabs defaultValue="all" className="w-full " dir="rtl">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-10">
                <TabsList className="w-full flex">
                  {company.reviews.length > 0 && (
                    <TabsTrigger value="all" className="text-sm flex-1">
                      همه نظرات
                    </TabsTrigger>
                  )}
                  {filterReviews(company.reviews, "working").length > 0 && (
                    <TabsTrigger value="working" className="text-sm flex-1">
                      تجربه های کاری
                    </TabsTrigger>
                  )}
                  {filterReviews(company.reviews, "interview").length > 0 && (
                    <TabsTrigger value="interview" className="text-sm flex-1">
                      مصاحبه کاری
                    </TabsTrigger>
                  )}
                  {filterReviews(company.reviews, "salary").length > 0 && (
                    <TabsTrigger value="salary" className="text-sm flex-1">
                      حقوق
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value="all" dir="rtl">
                <div className="grid grid-cols-1 gap-6">
                  {filterReviews(company.reviews, "all").map(
                    (review, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow duration-300 relative"
                      >
                        <Link
                          href={`/review/${review.id}`}
                          className="absolute inset-0"
                        >
                          <span className="sr-only">مشاهده جزئیات نظر</span>
                        </Link>
                        <CardHeader className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl mb-1 truncate max-w-[90%]">
                                {review.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {formatDate(review.created_at) && (
                                  <>
                                    <Calendar className="h-4 w-4" />
                                    <time>{formatDate(review.created_at)}</time>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                review.review_status === "NOT_WORKING"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {review.review_status === "NOT_WORKING"
                                ? "تجربه کاری"
                                : "مصاحبه"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rate
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent className="relative overflow-hidden">
                          <div
                            className="prose prose-lg dark:prose-invert max-w-none line-clamp-4 overflow-hidden"
                            dangerouslySetInnerHTML={{
                              __html: review.description,
                            }}
                          />
                          {review.salary && review.salary > 0 && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                حقوق:{" "}
                                {toPersianNumbers(review.salary)
                                  .split("")
                                  .reverse()
                                  .reduce((acc, digit, i) => {
                                    if (i > 0 && i % 3 === 0) {
                                      return digit + "," + acc;
                                    }
                                    return digit + acc;
                                  }, "")}{" "}
                                تومان
                              </span>
                            </div>
                          )}
                          <Link
                            href={`/review/${review.id}`}
                            className="absolute inset-0"
                          >
                            <span className="sr-only">مشاهده جزئیات نظر</span>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="working" dir="rtl">
                <div className="grid grid-cols-1 gap-6">
                  {filterReviews(company.reviews, "working").map(
                    (review, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardHeader className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl mb-1 truncate max-w-[90%]">
                                {review.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {formatDate(review.created_at) && (
                                  <>
                                    <Calendar className="h-4 w-4" />
                                    <time>{formatDate(review.created_at)}</time>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                review.review_status === "NOT_WORKING"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {review.review_status === "NOT_WORKING"
                                ? "تجربه کاری"
                                : "مصاحبه"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rate
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent className="relative overflow-hidden">
                          <div
                            className="prose prose-lg dark:prose-invert max-w-none line-clamp-4 overflow-hidden"
                            dangerouslySetInnerHTML={{
                              __html: review.description,
                            }}
                          />
                          {review.salary && review.salary > 0 && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                حقوق:{" "}
                                {toPersianNumbers(review.salary)
                                  .split("")
                                  .reverse()
                                  .reduce((acc, digit, i) => {
                                    if (i > 0 && i % 3 === 0) {
                                      return digit + "," + acc;
                                    }
                                    return digit + acc;
                                  }, "")}{" "}
                                تومان
                              </span>
                            </div>
                          )}
                          <Link
                            href={`/review/${review.id}`}
                            className="absolute inset-0"
                          >
                            <span className="sr-only">مشاهده جزئیات نظر</span>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="interview" dir="rtl">
                <div className="grid grid-cols-1 gap-6">
                  {filterReviews(company.reviews, "interview").map(
                    (review, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardHeader className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl mb-1 truncate max-w-[90%]">
                                {review.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {formatDate(review.created_at) && (
                                  <>
                                    <Calendar className="h-4 w-4" />
                                    <time>{formatDate(review.created_at)}</time>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                review.review_status === "NOT_WORKING"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {review.review_status === "NOT_WORKING"
                                ? "تجربه کاری"
                                : "مصاحبه"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rate
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent className="relative overflow-hidden">
                          <div
                            className="prose prose-lg dark:prose-invert max-w-none line-clamp-4 overflow-hidden"
                            dangerouslySetInnerHTML={{
                              __html: review.description,
                            }}
                          />
                          {review.salary && review.salary > 0 && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                حقوق:{" "}
                                {toPersianNumbers(review.salary)
                                  .split("")
                                  .reverse()
                                  .reduce((acc, digit, i) => {
                                    if (i > 0 && i % 3 === 0) {
                                      return digit + "," + acc;
                                    }
                                    return digit + acc;
                                  }, "")}{" "}
                                تومان
                              </span>
                            </div>
                          )}
                          <Link
                            href={`/review/${review.id}`}
                            className="absolute inset-0"
                          >
                            <span className="sr-only">مشاهده جزئیات نظر</span>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="salary" dir="rtl">
                <div className="grid grid-cols-1 gap-6">
                  {filterReviews(company.reviews, "salary").map(
                    (review, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl mb-1 truncate max-w-[90%]">
                                {review.job_title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {formatDate(review.created_at) && (
                                  <>
                                    <Calendar className="h-4 w-4" />
                                    <time>{formatDate(review.created_at)}</time>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                review.review_status === "NOT_WORKING"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {review.review_status === "NOT_WORKING"
                                ? "تجربه کاری"
                                : "مصاحبه"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rate
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent className="relative overflow-hidden">
                          {review.salary && review.salary > 0 && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                حقوق:{" "}
                                {toPersianNumbers(review.salary)
                                  .split("")
                                  .reverse()
                                  .reduce((acc, digit, i) => {
                                    if (i > 0 && i % 3 === 0) {
                                      return digit + "," + acc;
                                    }
                                    return digit + acc;
                                  }, "")}{" "}
                                تومان
                              </span>
                            </div>
                          )}
                          <Link
                            href={`/review/${review.id}`}
                            className="absolute inset-0"
                          >
                            <span className="sr-only">مشاهده جزئیات نظر</span>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-center text-muted-foreground">
              هنوز نظری ثبت نشده است.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const actualParams = await params;
  const company = await getCompanyBySlug(actualParams.slug);
  if (!company) return {};

  const metadata = generateCompanyMetadata(company);
  const canonicalUrl = `https://tajrobat.work/company/${actualParams.slug}`;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      type: "website",
      locale: "fa_IR",
    },
  };
}
