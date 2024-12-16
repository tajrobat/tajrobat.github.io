import { Review } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Calendar, Briefcase } from "lucide-react";
import { cn, formatDate, toPersianNumbers } from "@/lib/utils";
import Link from "next/link";
import { ShareButton } from "./ShareButton";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export default function ReviewCard({ review, className }: ReviewCardProps) {
  const shareUrl = `https://tajrobat.work/review/${review.id}`;
  const shareTitle = `${review.job_title ? `${review.job_title} در ` : ""}${
    review.company.name
  }`;
  const shareText = review.description
    .replace(/<[^>]*>/g, "")
    .substring(0, 160);

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl mb-1 truncate">
              {review.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <time className="truncate">{formatDate(review.created_at)}</time>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton title={shareTitle} text={shareText} url={shareUrl} />
            <Badge
              variant={
                review.review_status === "NOT_WORKING" ? "secondary" : "default"
              }
            >
              {review.review_status === "NOT_WORKING" ? "تجربه کاری" : "مصاحبه"}
            </Badge>
          </div>
        </div>
        {/* Rest of the card content */}
      </CardHeader>
    </Card>
  );
}
