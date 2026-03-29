import { redirect } from "next/navigation";

export default function CountryAboutRedirectPage({ params }: { params: { country: string } }) {
  redirect(`/${params.country}`);
}
