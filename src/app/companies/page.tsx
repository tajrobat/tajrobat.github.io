import { getAllCompanies } from "@/data/companies";
import CompaniesClient from "@/components/CompaniesClient";

export const dynamic = "force-static";

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

        <CompaniesClient companies={companies} />
      </div>
    </main>
  );
}
