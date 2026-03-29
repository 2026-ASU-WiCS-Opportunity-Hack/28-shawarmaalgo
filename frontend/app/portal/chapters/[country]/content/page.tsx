import { redirect } from 'next/navigation';

export default function LegacyChapterContentPage({ params }: { params: { country: string } }) {
  redirect(`/portal/chapter/${params.country}/content`);
}
