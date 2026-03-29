import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getChapter } from "@/lib/server-data";
import { CountrySubnav } from "@/components/layout/CountrySubnav";

export const revalidate = 3600;

export default async function CountryLayout({ children, params }: { children: ReactNode; params: { country: string } }) {
  const country = await getChapter(params.country);
  if (!country) {
    notFound();
  }

  return (
    <>
      <CountrySubnav slug={params.country} />
      {children}
    </>
  );
}
