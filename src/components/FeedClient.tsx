"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, ArrowUpRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Company, Review } from "@/app/types";

const ITEMS_PER_PAGE = 10;

export default function FeedClient({ companies }: { companies: Company[] }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();

  // Get all reviews from companies and sort by date
  const getAllReviews = useCallback(() => {
    const allReviews: Review[] = [];
    companies.forEach((company) => {
      company.reviews.forEach((review) => {
        allReviews.push({
          ...review,
          company: {
            id: company.id,
            name: company.name,
            slug: company.slug,
          },
        });
      });
    });

    return allReviews.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, []);

  const loadMoreReviews = useCallback(() => {
    if (loading) return;

    setLoading(true);
    const allReviews = getAllReviews();
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newReviews = allReviews.slice(start, end);

    if (newReviews.length > 0) {
      setReviews((prev) => [...prev, ...newReviews]);
      setPage((prev) => prev + 1);
    }

    setHasMore(newReviews.length === ITEMS_PER_PAGE);
    setLoading(false);
  }, [page, loading, getAllReviews]);

  const lastReviewRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreReviews();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreReviews]
  );

  useEffect(() => {
    loadMoreReviews();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {reviews.map((review, index) => (
        <Card
          key={review.id}
          className="hover:shadow-lg transition-shadow duration-300"
          ref={index === reviews.length - 1 ? lastReviewRef : undefined}
        >
          <CardHeader className="space-y-3">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/unknown.jpg" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {review.company.name?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/company/${
                      review.company.slug ?? review.company.id
                    }`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {review.company.name}
                  </Link>
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

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={review.created_at}>
                    {formatDate(review.created_at)}
                  </time>
                </div>
              </div>
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

          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">{review.title}</h3>

            <div
              className="prose prose-sm dark:prose-invert max-w-none line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: review.description,
              }}
            />

            <Link
              href={`/review/${review.id}`}
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>ادامه مطلب</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      ))}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      )}
    </div>
  );
}
