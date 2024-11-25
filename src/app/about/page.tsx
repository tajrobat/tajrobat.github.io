import { Card, CardContent } from "@/components/ui/card";
import { Mail, Github, Twitter } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "درباره ما | تجربت",
  description:
    "درباره تجربت - پلتفرم اشتراک‌گذاری تجربیات کاری در شرکت‌های ایرانی",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">درباره تجربت</h1>

          <Card>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none p-6">
              <p>
                تجربت یک پلتفرم آزاد و متن‌باز برای اشتراک‌گذاری تجربیات کاری در
                شرکت‌های ایرانی است. هدف ما کمک به افراد جویای کار برای
                تصمیم‌گیری بهتر در انتخاب محل کار است.
              </p>

              <h2>چرا تجربت؟</h2>
              <ul>
                <li>اشتراک‌گذاری تجربیات واقعی کارمندان و کارجویان</li>
                <li>دسترسی رایگان و بدون محدودیت به تمامی تجربیات</li>
                <li>حفظ حریم خصوصی نویسندگان تجربیات</li>
                <li>کد متن‌باز و شفافیت در عملکرد</li>
              </ul>

              <h2>مشارکت</h2>
              <p>
                تجربت یک پروژه متن‌باز است و از مشارکت همه استقبال می‌کند. برای
                مشارکت می‌توانید به مخزن گیت‌هاب پروژه مراجعه کنید.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8 not-prose">
                <Link
                  href="https://github.com/tajrobat/tajrobat.github.io"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>گیت‌هاب</span>
                </Link>
                {/* <Link
                  href="https://twitter.com/tajrobat"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span>توییتر</span>
                </Link>
                <Link
                  href="mailto:contact@tajrobat.ir"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>ایمیل</span>
                </Link> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
