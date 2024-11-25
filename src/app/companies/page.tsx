import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCompanies } from "@/data/companies";
import CompaniesClient from "@/components/CompaniesClient";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{}];
}

export const metadata = {
  title: "لیست شرکت‌ها | تجربت",
  description: "جستجو و مشاهده لیست کامل شرکت‌های ایرانی به همراه تجربیات کاری",
};

export default function CompaniesPage() {
  const companies = getAllCompanies();
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">لیست شرکت‌ها</h1>
          <p className="text-muted-foreground">
            جستجو در بین شرکت‌های ایرانی و مشاهده تجربیات کاری
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <CompanySkeleton key={i} />
              ))}
            </div>
          }
        >
          <CompaniesClient companies={companies} />
        </Suspense>
      </div>
    </main>
  );
}

function CompanySkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
