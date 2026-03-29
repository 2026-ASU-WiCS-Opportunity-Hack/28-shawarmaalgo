import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { getManagedUsersRaw } from '@/lib/server-data';
import { EditChapterSettingsForm } from '@/app/portal/admin/chapters/[slug]/EditChapterSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminChapterDetailPage({ params }: { params: { slug: string } }) {
  const [response, users] = await Promise.all([api.listChapters({ page_size: 100 }), getManagedUsersRaw()]);
  const chapter = response.data.find((item) => item.slug === params.slug);
  if (!chapter) notFound();

  const chapterLeaders = users
    .filter((user) => user.role === 'chapter_lead' && user.chapter_id === chapter.id)
    .map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.created_at
    }));

  return <EditChapterSettingsForm chapter={chapter} chapterLeaders={chapterLeaders} />;
}
