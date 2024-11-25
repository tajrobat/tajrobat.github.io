import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-6 py-12 mx-auto">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-8">
          <Link href="/" className="block">
            <Image
              src="/logo.png"
              alt="تجربت"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <p className="text-base text-muted-foreground/90 leading-7 font-vazirmatn">
            تجربت پلتفرمی برای به اشتراک‌گذاری تجربیات کاری و مصاحبه‌های شغلی در
            شرکت‌های ایرانی است.
          </p>
          {/* 
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-muted-foreground/90 hover:text-primary transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-muted-foreground/90 hover:text-primary transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.923 10.931 5 13.029 5H15v3z" />
              </svg>
            </a>
          </div> */}

          <div className="pt-8 border-t border-border/40 w-full text-center">
            <p className="text-sm text-muted-foreground/75">
              تجربت. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
