import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  ArrowRight,
  Globe,
  Users,
  Award,
  Calendar,
  CheckCircle,
  Quote,
  MapPin,
} from 'lucide-react'
import { api } from '@/lib/api'
import { stats as mockStats, testimonials as mockTestimonials, events as mockEvents, chapters as mockChapters } from '@/lib/mock-data'

export default async function HomePage() {
  let stats = mockStats
  let featuredTestimonials = mockTestimonials.slice(0, 3)
  let upcomingEvents = mockEvents.slice(0, 3)
  let featuredChapters = mockChapters.slice(0, 4)

  try {
    const [chaptersRes, eventsRes, coachesRes] = await Promise.all([
      api.chapters.list({ page_size: 4, status: 'active' }),
      api.events.list({ page_size: 3 }),
      api.coaches.list({ page_size: 1, approved: true }),
    ])

    featuredChapters = chaptersRes.data
    upcomingEvents = eventsRes.data
    // If you want to keep testimonials as mock for now (since no backend yet)
    // featuredTestimonials = mockTestimonials.slice(0, 3) 
  } catch (err) {
    console.error('Failed to fetch from API, using mock data:', err)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary px-4 py-24 text-primary-foreground md:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="container relative mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6">
                30+ Years of Transformative Learning
              </Badge>
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Transform Leadership Through the Power of Questions
              </h1>
              <p className="mb-8 text-balance text-lg text-primary-foreground/80 md:text-xl">
                The World Institute for Action Learning empowers organizations worldwide with
                proven methodologies that turn challenges into learning opportunities.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/coaches">
                    Find a Coach
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-background hover:bg-primary-foreground/10" asChild>
                  <Link href="/certification">Get Certified</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stats.totalCoaches.toLocaleString()}+
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Certified Coaches</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stats.countriesActive}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Countries Active</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stats.organizationsTrained.toLocaleString()}+
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Organizations Trained</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stats.yearsExperience}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Years of Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Action Learning */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                What is Action Learning?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Action Learning is a process that involves a small group working on real problems,
                taking action, and learning as individuals and as a team while doing so.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Real Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Teams work on actual organizational challenges, not simulations. This ensures
                    immediate relevance and impact.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Powerful Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Questions drive the process, promoting deeper thinking, reflection, and
                    breakthrough insights.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Lasting Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Participants develop leadership skills while solving problems, creating
                    sustainable organizational change.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href="/about#methodology">
                  Learn More About Our Methodology
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Certification Paths */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Certification Pathways
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Whether you are just starting or advancing your career, WIAL offers certification
                programs to match your goals.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="relative overflow-hidden border-border bg-card">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-secondary/20" />
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">Entry Level</Badge>
                  <CardTitle className="mt-2 text-2xl text-foreground">SALC</CardTitle>
                  <CardDescription>Student Action Learning Coach</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      3-day intensive workshop
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      Core methodology training
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      Practical facilitation skills
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/certification#salc">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-primary bg-card shadow-lg">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-primary/20" />
                <CardHeader>
                  <Badge className="w-fit">Most Popular</Badge>
                  <CardTitle className="mt-2 text-2xl text-foreground">CALC</CardTitle>
                  <CardDescription>Certified Action Learning Coach</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Advanced workshop training
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      50+ hours coaching practice
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Case study portfolio
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full" asChild>
                      <Link href="/certification#calc">Get Started</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-border bg-card">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-accent/20" />
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Advanced</Badge>
                  <CardTitle className="mt-2 text-2xl text-foreground">MALC</CardTitle>
                  <CardDescription>Master Action Learning Coach</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      Master-level intensive
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      200+ hours coaching
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      Train other coaches
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/certification#malc">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Global Chapters */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                  Global Presence
                </h2>
                <p className="text-lg text-muted-foreground">
                  Find a WIAL chapter near you
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/chapters">
                  View All Chapters
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredChapters.map((chapter) => (
                <Link key={chapter.id} href={`/${chapter.slug}`}>
                  <Card className="h-full border-border bg-card transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg text-foreground">{chapter.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {chapter.region}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {chapter.description}
                      </p>
                      {chapter.member_count && (
                        <p className="mt-3 text-sm font-medium text-primary">
                          {chapter.member_count}+ members
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                  Upcoming Events
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join workshops, webinars, and conferences worldwide
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/events">
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={event.is_free ? 'secondary' : 'outline'}>
                        {event.is_free ? 'Free' : `$${event.price_amount}`}
                      </Badge>
                      <Badge variant="outline">{event.event_type}</Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg text-foreground">{event.title}</CardTitle>
                    <CardDescription>{event.chapter_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {event.location_type === 'online'
                        ? 'Online'
                        : event.location_type === 'hybrid'
                        ? 'Hybrid'
                        : event.venue_name}
                    </div>
                    <Button variant="outline" className="mt-4 w-full" asChild>
                      <Link href={`/events/${event.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                What Our Community Says
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Hear from leaders and organizations who have experienced the power of Action
                Learning.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featuredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-border bg-card">
                  <CardContent className="pt-6">
                    <Quote className="mb-4 h-8 w-8 text-primary/30" />
                    <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {testimonial.author_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{testimonial.author_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.author_title}
                          {testimonial.author_company && `, ${testimonial.author_company}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Organization?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
              Connect with a certified Action Learning Coach or start your certification journey
              today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/coaches">Find a Coach</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
