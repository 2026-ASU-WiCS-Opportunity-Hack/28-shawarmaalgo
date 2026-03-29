import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { EditChapterSettingsForm } from '@/app/portal/admin/chapters/[slug]/EditChapterSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminChapterDetailPage({ params }: { params: { slug: string } }) {
  const response = await api.listChapters({ page_size: 100 });
  const chapter = response.data.find((item) => item.slug === params.slug);
  if (!chapter) notFound();

  return <EditChapterSettingsForm chapter={chapter} />;
}
