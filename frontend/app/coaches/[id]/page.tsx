import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Award,
  Calendar,
  Languages,
  ArrowLeft,
} from 'lucide-react'
import { coaches } from '@/lib/mock-data'

interface CoachProfilePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CoachProfilePageProps) {
  const { id } = await params
  const coach = coaches.find((c) => c.id === id)

  if (!coach) {
    return {
      title: 'Coach Not Found - WIAL',
    }
  }

  return {
    title: `${coach.first_name} ${coach.last_name} - WIAL Certified Coach`,
    description: coach.bio || `${coach.first_name} ${coach.last_name} is a ${coach.certification_level} certified Action Learning Coach.`,
  }
}

export default async function CoachProfilePage({ params }: CoachProfilePageProps) {
  const { id } = await params
  const coach = coaches.find((c) => c.id === id)

  if (!coach) {
    notFound()
  }

  const certificationColor = {
    SALC: 'bg-secondary/10 text-secondary border-secondary/30',
    CALC: 'bg-primary/10 text-primary border-primary/30',
    MALC: 'bg-accent/10 text-accent border-accent/30',
  }

  const certificationLabel = {
    SALC: 'Student Action Learning Coach',
    CALC: 'Certified Action Learning Coach',
    MALC: 'Master Action Learning Coach',
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/coaches">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <Card className="mb-8 border-border bg-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {coach.first_name.charAt(0)}
                      {coach.last_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                          {coach.first_name} {coach.last_name}
                        </h1>
                        <Badge className={certificationColor[coach.certification_level]}>
                          <Award className="mr-1 h-3 w-3" />
                          {coach.certification_level}
                        </Badge>
                      </div>
                      <p className="mb-4 text-muted-foreground">
                        {certificationLabel[coach.certification_level]}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {coach.city ? `${coach.city}, ` : ''}
                          {coach.country}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Certified since{' '}
                          {new Date(coach.certification_date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bio */}
              {coach.bio && (
                <Card className="mb-8 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground">{coach.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Specializations */}
              <Card className="mb-8 border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {coach.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Languages className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {coach.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24 border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${coach.email}`}
                        className="text-sm font-medium text-foreground hover:text-primary"
                      >
                        {coach.email}
                      </a>
                    </div>
                  </div>

                  {coach.phone && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${coach.phone}`}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          {coach.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {coach.linkedin_url && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Linkedin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">LinkedIn</p>
                        <a
                          href={coach.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}

                  {coach.website_url && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a
                          href={coach.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Chapter</p>
                    <Link
                      href={`/${coach.chapter_id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {coach.chapter_name}
                    </Link>
                  </div>

                  <Separator />

                  <Button className="w-full" asChild>
                    <a href={`mailto:${coach.email}`}>Contact Coach</a>
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
