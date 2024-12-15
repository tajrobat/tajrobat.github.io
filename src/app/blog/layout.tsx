import { Metadata } from "next";

export const metadata: Metadata = {
  title: "وبلاگ تجربت | مقالات و راهنمای‌های مرتبط با کار و استخدام",
  description:
    "مجموعه مقالات و راهنماهای کاربردی درباره کار، استخدام، مصاحبه شغلی و تجربیات کاری در شرکت‌های ایرانی",
  keywords: [
    "وبلاگ تجربت",
    "مقالات کاری",
    "راهنمای استخدام",
    "مصاحبه شغلی",
    "تجربیات کاری",
  ],
  openGraph: {
    title: "وبلاگ تجربت",
    description: "مقالات و راهنمای‌های مرتبط با کار و استخدام",
    type: "website",
    locale: "fa_IR",
    siteName: "تجربت",
  },
  alternates: {
    canonical: "https://tajrobat.work/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-12">{children}</div>
    </div>
  );
}
