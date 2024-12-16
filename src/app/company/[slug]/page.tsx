import { Virtuoso } from "react-virtuoso";
import dynamic from "next/dynamic";
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
import { getCompanyData } from "@/lib/api";

// Create a ReviewCard component for virtualization
const ReviewCard = dynamic(() => import("@/components/ReviewCard"), {
  loading: () => <ReviewSkeleton />,
});

// Virtualized review list component
const VirtualizedReviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <Virtuoso
      style={{ height: "800px" }}
      totalCount={reviews.length}
      itemContent={(index) => (
        <ReviewCard review={reviews[index]} className="mb-4" />
      )}
    />
  );
};

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = getCompanyData(params.slug);
  if (!company) notFound();

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
                              <CardTitle className="text-xl mb-1 truncate">
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
                              <CardTitle className="text-xl mb-1">
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
                              <CardTitle className="text-xl mb-1">
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
                              <CardTitle className="text-xl mb-1">
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

// Generate static paths
export function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug || company.id.toString(),
  }));
}
