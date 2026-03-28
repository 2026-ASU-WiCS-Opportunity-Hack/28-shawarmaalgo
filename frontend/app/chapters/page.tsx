import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, MapPin, Users, ArrowRight, Mail } from 'lucide-react'
import { chapters } from '@/lib/mock-data'

export const metadata = {
  title: 'WIAL Chapters - Global Network',
  description:
    'Explore WIAL chapters worldwide. Find Action Learning resources, certified coaches, and events in your region.',
}

// Group chapters by region
const chaptersByRegion = chapters.reduce((acc, chapter) => {
  if (!acc[chapter.region]) {
    acc[chapter.region] = []
  }
  acc[chapter.region].push(chapter)
  return acc
}, {} as Record<string, typeof chapters>)

const regions = Object.keys(chaptersByRegion).sort()

export default function ChaptersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary px-4 py-16 text-primary-foreground">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                Global Network
              </Badge>
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                WIAL Chapters Worldwide
              </h1>
              <p className="text-primary-foreground/80">
                WIAL operates through a network of regional chapters, each bringing Action
                Learning to their local communities while maintaining global standards of
                excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{chapters.length}</div>
                <p className="text-sm text-muted-foreground">Active Chapters</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{regions.length}</div>
                <p className="text-sm text-muted-foreground">Regions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {chapters.reduce((sum, c) => sum + (c.member_count || 0), 0).toLocaleString()}+
                </div>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">47</div>
                <p className="text-sm text-muted-foreground">Countries Served</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters by Region */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            {regions.map((region) => (
              <div key={region} className="mb-12 last:mb-0">
                <div className="mb-6 flex items-center gap-3">
                  <Globe className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">{region}</h2>
                  <Badge variant="secondary">
                    {chaptersByRegion[region].length} chapter
                    {chaptersByRegion[region].length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {chaptersByRegion[region].map((chapter) => (
                    <Card
                      key={chapter.id}
                      className="flex flex-col border-border bg-card transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg text-foreground">{chapter.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {chapter.country}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col">
                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                          {chapter.description}
                        </p>

                        <div className="mb-4 flex flex-wrap gap-2">
                          {chapter.supported_languages.slice(0, 3).map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang.toUpperCase()}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {chapter.member_count && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              {chapter.member_count}+ members
                            </div>
                          )}
                          {chapter.founded_year && (
                            <span className="text-xs text-muted-foreground">
                              Est. {chapter.founded_year}
                            </span>
                          )}
                        </div>

                        <Button variant="outline" className="mt-4 w-full" asChild>
                          <Link href={`/${chapter.slug}`}>
                            Visit Chapter
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Start a Chapter CTA */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-2xl border-primary bg-card">
              <CardContent className="p-8 text-center">
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  Interested in Starting a Chapter?
                </h2>
                <p className="mb-6 text-muted-foreground">
                  If there is not a WIAL chapter in your region, you may be able to help us
                  establish one. We are always looking for passionate Action Learning advocates
                  to expand our global network.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild>
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Us
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/certification">Learn About Certification</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
