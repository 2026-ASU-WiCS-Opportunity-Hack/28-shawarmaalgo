import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkout } from '@/components/checkout'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Video,
  ArrowLeft,
  Mail,
} from 'lucide-react'
import { events } from '@/lib/mock-data'

interface EventPageProps {
  params: Promise<{ id: string }>
}

// Map event IDs to product IDs (in real app, this would be in the database)
const eventToProduct: Record<string, string> = {
  '1': 'salc-workshop-event',
  '3': 'global-conference',
  '4': 'african-leaders-training',
  '6': 'calc-workshop-event',
}

export async function generateMetadata({ params }: EventPageProps) {
  const { id } = await params
  const event = events.find((e) => e.id === id)

  if (!event) {
    return {
      title: 'Event Not Found - WIAL',
    }
  }

  return {
    title: `${event.title} - WIAL Events`,
    description: event.description || `Join us for ${event.title}`,
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = events.find((e) => e.id === id)

  if (!event) {
    notFound()
  }

  const productId = eventToProduct[id]
  const spotsRemaining = event.max_attendees
    ? event.max_attendees - (event.current_attendees || 0)
    : null

  const getLocationIcon = () => {
    switch (event.location_type) {
      case 'online':
        return <Video className="h-5 w-5" />
      case 'hybrid':
        return <Globe className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Event Header */}
              <Card className="mb-8 border-border bg-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant={event.is_free ? 'secondary' : 'outline'}>
                      {event.is_free ? 'Free Event' : `$${event.price_amount} ${event.price_currency}`}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {event.event_type}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {event.location_type.replace('_', ' ')}
                    </Badge>
                  </div>

                  <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
                    {event.title}
                  </h1>
                  {event.title_local && event.title_local !== event.title && (
                    <p className="mb-4 text-lg text-muted-foreground">{event.title_local}</p>
                  )}

                  <p className="text-muted-foreground">
                    Hosted by{' '}
                    <Link href={`/${event.chapter_id}`} className="text-primary hover:underline">
                      {event.chapter_name}
                    </Link>
                  </p>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card className="mb-8 border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {event.description && (
                    <div>
                      <p className="whitespace-pre-wrap text-muted-foreground">
                        {event.description}
                      </p>
                      {event.description_local && event.description_local !== event.description && (
                        <p className="mt-4 whitespace-pre-wrap text-muted-foreground">
                          {event.description_local}
                        </p>
                      )}
                    </div>
                  )}

                  <Separator />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.start_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {event.end_date && event.end_date !== event.start_date && (
                            <>
                              {' - '}
                              {new Date(event.end_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Timezone</p>
                        <p className="text-sm text-muted-foreground">{event.timezone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        {getLocationIcon()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Location</p>
                        {event.location_type === 'online' ? (
                          <p className="text-sm text-muted-foreground">Online Event</p>
                        ) : event.location_type === 'hybrid' ? (
                          <>
                            <p className="text-sm text-muted-foreground">
                              {event.venue_name || 'Venue TBA'}
                            </p>
                            <p className="text-sm text-muted-foreground">+ Online Option</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground">
                              {event.venue_name || 'Venue TBA'}
                            </p>
                            {event.venue_address && (
                              <p className="text-sm text-muted-foreground">{event.venue_address}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {event.max_attendees && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Capacity</p>
                          <p className="text-sm text-muted-foreground">
                            {event.current_attendees || 0} / {event.max_attendees} registered
                          </p>
                          {spotsRemaining !== null && spotsRemaining <= 10 && spotsRemaining > 0 && (
                            <p className="text-sm font-medium text-destructive">
                              Only {spotsRemaining} spots left!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Registration / Checkout */}
              {!event.is_free && productId && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Register for This Event</CardTitle>
                    <CardDescription>Secure payment powered by Stripe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Checkout productId={productId} />
                  </CardContent>
                </Card>
              )}

              {event.is_free && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Register for This Event</CardTitle>
                    <CardDescription>This is a free event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">
                      This event is free to attend. Contact the organizing chapter to register.
                    </p>
                    <Button asChild>
                      <Link href="/contact">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact to Register
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24 border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Event Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold text-foreground">
                      {event.is_free ? 'Free' : `$${event.price_amount} ${event.price_currency}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Format</span>
                    <span className="capitalize text-foreground">
                      {event.location_type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize text-foreground">{event.event_type}</span>
                  </div>

                  {event.registration_deadline && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Deadline</p>
                        <p className="font-medium text-foreground">
                          {new Date(event.registration_deadline).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Organized by</p>
                    <Link
                      href={`/${event.chapter_id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {event.chapter_name}
                    </Link>
                  </div>

                  <Separator />

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/events">View All Events</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
