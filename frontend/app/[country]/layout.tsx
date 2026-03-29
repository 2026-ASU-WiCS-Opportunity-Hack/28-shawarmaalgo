import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getCountryBySlug } from "@/data/countries";
import { CountrySubnav } from "@/components/layout/CountrySubnav";

export const revalidate = 3600;

export default function CountryLayout({ children, params }: { children: ReactNode; params: { country: string } }) {
  const country = getCountryBySlug(params.country);
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
