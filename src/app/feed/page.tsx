import { Suspense } from "react";
import FeedClient from "@/components/FeedClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCompanies } from "@/data/companies";

export const metadata = {
  title: "فید تجربیات | تجربت",
  description: "آخرین تجربیات کاری و مصاحبه‌های شغلی در شرکت‌های ایرانی",
};

export default function FeedPage() {
  const companies = getAllCompanies();
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <FeedSkeleton key={i} />
              ))}
            </div>
          }
        >
          <FeedClient companies={companies} />
        </Suspense>
      </div>
    </main>
  );
}

function FeedSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
