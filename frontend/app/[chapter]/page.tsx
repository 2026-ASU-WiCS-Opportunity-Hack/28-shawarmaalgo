import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CoachCard } from '@/components/coach-card'
import {
  MapPin,
  Mail,
  Globe,
  Calendar,
  Users,
  ArrowRight,
  Clock,
  Languages,
  Award,
} from 'lucide-react'
import { api } from '@/lib/api'
import { chapters as mockChapters, coaches as mockCoaches, events as mockEvents } from '@/lib/mock-data'

interface ChapterPageProps {
  params: Promise<{ chapter: string }>
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { chapter: chapterSlug } = await params
  let chapter = mockChapters.find((c) => c.slug === chapterSlug)

  try {
    const res = await api.chapters.list({ page_size: 100 })
    const found = res.data.find((c) => c.slug === chapterSlug)
    if (found) chapter = found
  } catch (err) {}

  if (!chapter) {
    return {
      title: 'Chapter Not Found - WIAL',
    }
  }

  return {
    title: `${chapter.name} - WIAL`,
    description: chapter.description || `${chapter.name} - Action Learning chapter serving ${chapter.country}`,
  }
}

export async function generateStaticParams() {
  try {
    const res = await api.chapters.list({ page_size: 100 })
    if (res.data.length > 0) {
      return res.data.map((chapter) => ({
        chapter: chapter.slug,
      }))
    }
  } catch (err) {}

  return mockChapters.map((chapter) => ({
    chapter: chapter.slug,
  }))
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapter: chapterSlug } = await params

  let chapter = mockChapters.find((c) => c.slug === chapterSlug)
  let chapterCoaches = mockCoaches.filter((coach) => coach.chapter_id === chapter?.id)
  let chapterEvents = mockEvents.filter((event) => event.chapter_id === chapter?.id)

  try {
    const res = await api.chapters.list({ page_size: 100 })
    const found = res.data.find((c) => c.slug === chapterSlug)
    if (found) {
      chapter = found
      const [coachesRes, eventsRes] = await Promise.all([
        api.coaches.list({ chapter_id: chapter.id, page_size: 100 }),
        api.events.list({ chapter_id: chapter.id, page_size: 100 }),
      ])
      chapterCoaches = coachesRes.data
      chapterEvents = eventsRes.data
    }
  } catch (err) {
    console.error('Failed to fetch chapter details from API, using mock data:', err)
  }

  if (!chapter) {
    notFound()
  }


  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary px-4 py-20 text-primary-foreground">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                {chapter.region}
              </Badge>
              <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                {chapter.name}
              </h1>
              <p className="mb-2 flex items-center justify-center gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                {chapter.country}
              </p>
              {chapter.description && (
                <p className="mt-4 text-lg text-primary-foreground/80">{chapter.description}</p>
              )}
              {chapter.description_local && chapter.description_local !== chapter.description && (
                <p className="mt-2 text-primary-foreground/60">{chapter.description_local}</p>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {chapter.member_count || 0}+
                </div>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{chapterCoaches.length}</div>
                <p className="text-sm text-muted-foreground">Certified Coaches</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{chapterEvents.length}</div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {chapter.founded_year || 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground">Established</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter Info */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* About Section */}
                <Card className="mb-8 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">About {chapter.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-muted-foreground">
                      {chapter.description ||
                        `${chapter.name} is dedicated to advancing Action Learning in ${chapter.country}. We offer certification programs, workshops, and a community of certified coaches committed to transforming organizations through the power of questions.`}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <Languages className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Languages</p>
                          <p className="text-sm text-muted-foreground">
                            {chapter.supported_languages
                              .map((l) => l.toUpperCase())
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Timezone</p>
                          <p className="text-sm text-muted-foreground">{chapter.timezone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Currency</p>
                          <p className="text-sm text-muted-foreground">{chapter.currency}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Region</p>
                          <p className="text-sm text-muted-foreground">{chapter.region}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chapter Coaches */}
                {chapterCoaches.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">Our Coaches</h2>
                      <Button variant="outline" asChild>
                        <Link href={`/coaches?chapter=${chapter.id}`}>
                          View All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {chapterCoaches.slice(0, 4).map((coach) => (
                        <CoachCard key={coach.id} coach={coach} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Chapter Events */}
                {chapterEvents.length > 0 && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                      <Button variant="outline" asChild>
                        <Link href={`/events?chapter=${chapter.id}`}>
                          View All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {chapterEvents.slice(0, 3).map((event) => (
                        <Card key={event.id} className="border-border bg-card">
                          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="mb-2 flex flex-wrap gap-2">
                                <Badge variant={event.is_free ? 'secondary' : 'outline'}>
                                  {event.is_free ? 'Free' : `$${event.price_amount}`}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {event.event_type}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-foreground">{event.title}</h3>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(event.start_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                            <Button asChild>
                              <Link href={`/events/${event.id}`}>Register</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                <Card className="sticky top-24 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Contact {chapter.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${chapter.contact_email}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {chapter.contact_email}
                        </a>
                      </div>
                    </div>

                    {chapter.website_url && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <a
                            href={chapter.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground hover:text-primary"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                      <Button className="w-full" asChild>
                        <a href={`mailto:${chapter.contact_email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Chapter
                        </a>
                      </Button>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/certification">Get Certified</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/coaches">Find a Coach</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to Start Your Action Learning Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
              Whether you want to become a certified coach or bring Action Learning to your
              organization, {chapter.name} is here to help.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/certification">
                  Get Certified
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <a href={`mailto:${chapter.contact_email}`}>Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
