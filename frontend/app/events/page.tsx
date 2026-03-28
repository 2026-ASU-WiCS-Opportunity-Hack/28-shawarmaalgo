'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, MapPin, Users, Clock, Search, ArrowRight, Globe, Video } from 'lucide-react'
import { events, chapters } from '@/lib/mock-data'

const eventTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'conference', label: 'Conference' },
  { value: 'training', label: 'Training' },
  { value: 'meetup', label: 'Meetup' },
]

const locationTypes = [
  { value: 'all', label: 'All Formats' },
  { value: 'in_person', label: 'In Person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [eventType, setEventType] = useState('all')
  const [locationType, setLocationType] = useState('all')
  const [chapterFilter, setChapterFilter] = useState('all')

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.chapter_name?.toLowerCase().includes(query) ||
          event.venue_name?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Event type filter
      if (eventType !== 'all' && event.event_type !== eventType) {
        return false
      }

      // Location type filter
      if (locationType !== 'all' && event.location_type !== locationType) {
        return false
      }

      // Chapter filter
      if (chapterFilter !== 'all' && event.chapter_id !== chapterFilter) {
        return false
      }

      return true
    })
  }, [searchQuery, eventType, locationType, chapterFilter])

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Video className="h-4 w-4" />
      case 'hybrid':
        return <Globe className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary px-4 py-16 text-primary-foreground">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                Events
              </Badge>
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Upcoming Events & Workshops
              </h1>
              <p className="text-primary-foreground/80">
                Join certification workshops, webinars, and conferences hosted by WIAL chapters
                worldwide. Find events in your timezone and language.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="border-b border-border bg-background py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={locationType} onValueChange={setLocationType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={chapterFilter} onValueChange={setChapterFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="bg-background py-12">
          <div className="container mx-auto px-4">
            <p className="mb-6 text-sm text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>

            {filteredEvents.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="mb-2 text-lg font-medium text-foreground">No events found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or check back later for new events.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="flex flex-col border-border bg-card">
                    <CardHeader>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={event.is_free ? 'secondary' : 'outline'}>
                          {event.is_free ? 'Free' : `$${event.price_amount} ${event.price_currency}`}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {event.event_type}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {event.location_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-foreground">{event.title}</CardTitle>
                      <CardDescription>{event.chapter_name}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col">
                      {event.description && (
                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}

                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span>
                            {new Date(event.start_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {event.end_date && event.end_date !== event.start_date && (
                              <>
                                {' - '}
                                {new Date(event.end_date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getLocationIcon(event.location_type)}
                          <span>
                            {event.location_type === 'online'
                              ? 'Online Event'
                              : event.location_type === 'hybrid'
                              ? `${event.venue_name || 'TBA'} + Online`
                              : event.venue_name || 'Location TBA'}
                          </span>
                        </div>

                        {event.max_attendees && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4 shrink-0" />
                            <span>
                              {event.current_attendees || 0} / {event.max_attendees} registered
                            </span>
                          </div>
                        )}

                        {event.registration_deadline && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>
                              Register by{' '}
                              {new Date(event.registration_deadline).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <Button className="w-full" asChild>
                          <Link href={`/events/${event.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Host an Event with WIAL
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Are you a certified coach looking to host a workshop or training? Contact your
              local chapter to learn about hosting opportunities.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
