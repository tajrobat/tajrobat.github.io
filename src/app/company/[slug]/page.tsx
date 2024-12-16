import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, Briefcase, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { generateCompanyMetadata } from "@/app/metadata";
import { CompanyJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { getCompanyData } from "@/lib/api";
import { getAllCompanies } from "@/data/companies";
import CompanyReviews from "@/components/CompanyReviews";

// Helper function to convert numbers to Persian digits
const toPersianNumbers = (num: number): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => persianDigits[parseInt(x)]);
};

// Helper function to format salary
const formatSalary = (value: number) => {
  if (value <= 0) return "مشخص نیست";
  return `${toPersianNumbers(value)} میلیون`;
};

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = getCompanyData(params.slug);
  if (!company) notFound();

  // Define stats data
  const statsData = [
    {
      label: "میانگین نظرات",
      value: company.rate > 0 ? toPersianNumbers(company.rate) : "مشخص نیست",
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
      label: "حداقل حقوق",
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

        {/* Reviews Section */}
        <CompanyReviews reviews={company.reviews || []} />
      </div>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const company = getCompanyData(params.slug);
  if (!company) return {};

  const metadata = generateCompanyMetadata(company);
  const canonicalUrl = `https://tajrobat.work/company/${params.slug}`;

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
  const companies = getAllCompanies();
  return companies.map((company) => ({
    slug: company.slug || company.id.toString(),
  }));
}
