import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import {
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Award,
  Users,
  BookOpen,
  Target,
} from 'lucide-react'
import { certificationPrograms } from '@/lib/mock-data'

export const metadata = {
  title: 'Certification Programs - WIAL',
  description:
    'Explore WIAL certification pathways: SALC, CALC, and MALC. Become a certified Action Learning Coach.',
}

const benefits = [
  {
    icon: Award,
    title: 'Globally Recognized',
    description: 'WIAL certification is recognized by organizations in 47+ countries.',
  },
  {
    icon: Users,
    title: 'Join a Community',
    description: 'Connect with 2,500+ certified coaches worldwide.',
  },
  {
    icon: BookOpen,
    title: 'Continuous Learning',
    description: 'Access ongoing professional development and resources.',
  },
  {
    icon: Target,
    title: 'Career Growth',
    description: 'Enhance your coaching practice with proven methodology.',
  },
]

export default function CertificationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary px-4 py-20 text-primary-foreground">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                Certification
              </Badge>
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Become a Certified Action Learning Coach
              </h1>
              <p className="text-lg text-primary-foreground/80">
                WIAL offers three levels of certification to support your journey from aspiring
                coach to master practitioner. Choose the path that matches your experience and
                goals.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-b border-border bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Levels */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="salc" className="w-full">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Certification Levels
                </h2>
                <TabsList className="mx-auto">
                  <TabsTrigger value="salc">SALC</TabsTrigger>
                  <TabsTrigger value="calc">CALC</TabsTrigger>
                  <TabsTrigger value="malc">MALC</TabsTrigger>
                </TabsList>
              </div>

              {certificationPrograms.map((program) => (
                <TabsContent key={program.slug} value={program.slug} id={program.slug}>
                  <div className="mx-auto max-w-4xl">
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <div className="flex flex-wrap items-center gap-4">
                          <Badge
                            variant={
                              program.level === 'SALC'
                                ? 'secondary'
                                : program.level === 'CALC'
                                ? 'default'
                                : 'outline'
                            }
                          >
                            {program.level === 'SALC'
                              ? 'Entry Level'
                              : program.level === 'CALC'
                              ? 'Professional'
                              : 'Master'}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {program.duration_weeks} weeks
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            ${program.price_usd.toLocaleString()} USD
                          </div>
                        </div>
                        <CardTitle className="mt-4 text-2xl text-foreground">{program.name}</CardTitle>
                        <CardDescription className="text-base">{program.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-8 lg:grid-cols-2">
                          {/* Requirements */}
                          <div>
                            <h3 className="mb-4 font-semibold text-foreground">Requirements</h3>
                            <ul className="space-y-3">
                              {program.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  <span className="text-sm text-muted-foreground">{req}</span>
                                </li>
                              ))}
                            </ul>
                            {program.prerequisites && (
                              <div className="mt-6">
                                <h4 className="mb-2 text-sm font-medium text-foreground">
                                  Prerequisites:
                                </h4>
                                <ul className="space-y-1">
                                  {program.prerequisites.map((prereq, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-muted-foreground"
                                    >
                                      {prereq}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Learning Outcomes */}
                          <div>
                            <h3 className="mb-4 font-semibold text-foreground">
                              Learning Outcomes
                            </h3>
                            <ul className="space-y-3">
                              {program.learning_outcomes.map((outcome, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                                  <span className="text-sm text-muted-foreground">{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-2xl font-bold text-foreground">
                              ${program.price_usd.toLocaleString()} USD
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Includes all materials and certification
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" asChild>
                              <Link href="/events">View Upcoming Workshops</Link>
                            </Button>
                            <Button asChild>
                              <Link href={`/enroll/${program.slug}`}>
                                Enroll Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Compare Certification Levels
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Choose the certification that best matches your experience and career goals.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-border p-4 text-left font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="border-b border-border p-4 text-center font-semibold text-foreground">
                      SALC
                    </th>
                    <th className="border-b border-border bg-primary/5 p-4 text-center font-semibold text-foreground">
                      CALC
                    </th>
                    <th className="border-b border-border p-4 text-center font-semibold text-foreground">
                      MALC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">Duration</td>
                    <td className="border-b border-border p-4 text-center text-foreground">
                      1 week
                    </td>
                    <td className="border-b border-border bg-primary/5 p-4 text-center text-foreground">
                      12 weeks
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">
                      24 weeks
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">
                      Investment
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">
                      $1,500
                    </td>
                    <td className="border-b border-border bg-primary/5 p-4 text-center text-foreground">
                      $2,500
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">
                      $5,000
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">
                      Coaching Hours Required
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">-</td>
                    <td className="border-b border-border bg-primary/5 p-4 text-center text-foreground">
                      50+
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">
                      200+
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">
                      Can Train Others
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">-</td>
                    <td className="border-b border-border bg-primary/5 p-4 text-center text-foreground">
                      -
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">
                      <CheckCircle className="mx-auto h-5 w-5 text-primary" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">
                      Coach Directory Listing
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">-</td>
                    <td className="border-b border-border bg-primary/5 p-4 text-center text-foreground">
                      <CheckCircle className="mx-auto h-5 w-5 text-primary" />
                    </td>
                    <td className="border-b border-border p-4 text-center text-foreground">
                      <CheckCircle className="mx-auto h-5 w-5 text-primary" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Best For</td>
                    <td className="p-4 text-center text-sm text-foreground">
                      Beginning your AL journey
                    </td>
                    <td className="bg-primary/5 p-4 text-center text-sm text-foreground">
                      Professional coaches
                    </td>
                    <td className="p-4 text-center text-sm text-foreground">
                      Senior practitioners
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mx-auto grid max-w-4xl gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    How long does each certification take?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    SALC can be completed in a 3-day intensive workshop. CALC typically takes 12
                    weeks including practice hours. MALC is a 24-week journey that includes a
                    master thesis.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Can I complete certification online?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! We offer hybrid and fully virtual options for all certification levels.
                    Our virtual programs maintain the same rigor and quality as in-person
                    workshops.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    What support do I receive after certification?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All certified coaches receive ongoing support including access to the WIAL
                    community, continuing education opportunities, marketing resources, and
                    listing in our global coach directory (CALC and above).
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Are there payment plans available?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, we offer flexible payment plans for all certification levels. Contact
                    your local chapter or our global office to discuss options that work for
                    you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to Start Your Certification Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
              Join thousands of coaches who have transformed their careers with WIAL
              certification.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/events">
                  Find a Workshop
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
