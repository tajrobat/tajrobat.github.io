import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Github,
  Twitter,
  Mail,
  Linkedin,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "شبکه‌های اجتماعی | تجربت",
  description: "ارتباط با تجربت در شبکه‌های اجتماعی",
};

const socials = [
  {
    name: "گیت‌هاب",
    description: "مشاهده کد پروژه و مشارکت",
    icon: Github,
    url: "https://github.com/tajrobat/tajrobat.github.io",
    color: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "توییتر",
    description: "آخرین اخبار و اطلاعیه‌ها",
    icon: Twitter,
    url: "https://twitter.com/tajrobat",
    color: "text-blue-400",
  },
  {
    name: "لینکدین",
    description: "شبکه حرفه‌ای",
    icon: Linkedin,
    url: "https://linkedin.com/company/tajrobat",
    color: "text-blue-600",
  },
  {
    name: "اینستاگرام",
    description: "تصاویر و استوری‌های روزانه",
    icon: Instagram,
    url: "https://instagram.com/tajrobat",
    color: "text-pink-600",
  },
  {
    name: "تلگرام",
    description: "کانال رسمی تجربت",
    icon: MessageCircle,
    url: "https://t.me/tajrobat",
    color: "text-blue-500",
  },
  {
    name: "ایمیل",
    description: "ارتباط مستقیم با تیم",
    icon: Mail,
    url: "mailto:contact@tajrobat.ir",
    color: "text-red-500",
  },
];

export default function SocialsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            شبکه‌های اجتماعی
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {socials.map((social) => (
              <Card key={social.name} className="flex items-center gap-4 p-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    <Link
                      href={social.url}
                      className={`${social.color} hover:text-primary transition-colors`}
                    >
                      <social.icon className="h-8 w-8" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{social.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
