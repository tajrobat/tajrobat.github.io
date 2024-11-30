import { Metadata } from "next";

export const metadata: Metadata = {
  title: "وبلاگ | تجربت",
  description: "مقالات و راهنمای‌های مرتبط با کار و استخدام",
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
