import ChapterTestimonialsManager from '@/app/portal/chapter/[country]/ChapterTestimonialsManager';
import { PortalShell } from '@/components/portal/PortalShell';
import { api } from '@/lib/api';
import { requireChapterPortalAccess } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterTestimonialsPage({ params }: { params: { country: string } }) {
  const { chapter } = await requireChapterPortalAccess(params.country, {
    allowedRoles: ['chapter_lead'],
    pathSuffix: '/testimonials'
  });
  const testimonials = await api.listTestimonials({ chapter_id: chapter.id });

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} testimonials`}
      description="Create, update, and remove public testimonials shown on the chapter landing page."
      chapterSlug={chapter.slug}
    >
      <ChapterTestimonialsManager chapter={chapter} initialTestimonials={testimonials.data} />
    </PortalShell>
  );
}
