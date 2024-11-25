"use client";

import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Image
            src="/logo.png"
            alt="تجربت"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            تَجرُبَت
          </span>
        </Link>

        <div className="flex items-center ">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="/companies" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    شرکت ها
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="/feed" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    تجربه ها
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link
                  href="https://github.com/tajrobat/tajrobat.github.io"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    مشارکت
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    درباره ما
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="container px-6 py-4">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link href="/feed" className="block py-2 text-lg">
                    تجربه ها
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="block py-2 text-lg">
                    شرکت ها
                  </Link>
                </li>
                <li>
                  <Link href="/contribute" className="block py-2 text-lg">
                    مشارکت
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="block py-2 text-lg">
                    درباره ما
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
