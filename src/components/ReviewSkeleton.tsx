import { Card, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function ReviewSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-24 w-full" />
      </CardHeader>
    </Card>
  );
}
