import { Company } from "@/app/types";

interface CompanyJsonLdProps {
  company: Company;
}

export function CompanyJsonLd({ company }: CompanyJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    url: company.site,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: company.rate,
      reviewCount: company.total_review,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
