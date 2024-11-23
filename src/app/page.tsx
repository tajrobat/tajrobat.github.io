import { HomeClient } from "@/components/HomeClient";
import { Suspense } from "react";
import companies from "../../cached-companies.json";
import { Company } from "./types";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{}];
}

export default async function HomePage() {
  return (
    <Suspense>
      <HomeClient companies={companies as Company[]} />
    </Suspense>
  );
}
