"use client";

import { Virtuoso } from "react-virtuoso";
import dynamic from "next/dynamic";
import { Review } from "@/app/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReviewCard = dynamic(() => import("@/components/ReviewCard"), {
  loading: () => <ReviewSkeleton />,
});

interface CompanyReviewsProps {
  reviews: Review[];
}

export default function CompanyReviews({ reviews }: CompanyReviewsProps) {
  const filterReviews = (reviews: Review[], type: string) => {
    const sortedReviews = [...reviews].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

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

  return (
    <section className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">نظرات کاربران</h2>
      </div>

      {reviews && reviews.length > 0 ? (
        <Tabs defaultValue="all" className="w-full" dir="rtl">
          <TabsList className="w-full flex">
            <TabsTrigger value="all" className="text-sm flex-1">
              همه نظرات
            </TabsTrigger>
            {filterReviews(reviews, "working").length > 0 && (
              <TabsTrigger value="working" className="text-sm flex-1">
                تجربه های کاری
              </TabsTrigger>
            )}
            {filterReviews(reviews, "interview").length > 0 && (
              <TabsTrigger value="interview" className="text-sm flex-1">
                مصاحبه کاری
              </TabsTrigger>
            )}
            {filterReviews(reviews, "salary").length > 0 && (
              <TabsTrigger value="salary" className="text-sm flex-1">
                حقوق
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all">
            <Virtuoso
              style={{ height: "800px" }}
              totalCount={reviews.length}
              itemContent={(index) => (
                <ReviewCard review={reviews[index]} className="mb-4" />
              )}
            />
          </TabsContent>

          {/* Similar TabsContent for other tabs */}
        </Tabs>
      ) : (
        <p className="text-center text-muted-foreground">
          هنوز نظری ثبت نشده است.
        </p>
      )}
    </section>
  );
}
