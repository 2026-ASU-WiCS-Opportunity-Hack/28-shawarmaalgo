import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Target,
  Users,
  Lightbulb,
  Globe,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

export const metadata = {
  title: 'About WIAL - World Institute for Action Learning',
  description:
    'Learn about WIAL\'s mission, methodology, and global impact in transforming leadership through Action Learning.',
}

const timeline = [
  {
    year: '1995',
    title: 'WIAL Founded',
    description: 'Michael Marquardt establishes WIAL to advance Action Learning globally.',
  },
  {
    year: '2000',
    title: 'First International Chapter',
    description: 'WIAL expands beyond the US with chapters in Europe and Asia.',
  },
  {
    year: '2008',
    title: 'Africa Expansion',
    description: 'WIAL Nigeria launches, bringing Action Learning to West Africa.',
  },
  {
    year: '2015',
    title: 'Global Network',
    description: 'WIAL reaches 30+ countries with certified coaches worldwide.',
  },
  {
    year: '2020',
    title: 'Digital Transformation',
    description: 'Virtual Action Learning programs enable global accessibility.',
  },
  {
    year: '2024',
    title: 'AI-Enhanced Learning',
    description: 'Introducing AI-powered tools to enhance coaching effectiveness.',
  },
]

const leadership = [
  {
    name: 'Dr. Michael Marquardt',
    role: 'Founder & President Emeritus',
    bio: 'Pioneer of Action Learning methodology and author of 26 books on leadership and learning.',
  },
  {
    name: 'Dr. Bea Carson',
    role: 'Global President',
    bio: 'Leading WIAL\'s strategic vision and global expansion for over 15 years.',
  },
  {
    name: 'Skip Leonard',
    role: 'Chief Learning Officer',
    bio: 'Developing innovative certification programs and learning experiences.',
  },
  {
    name: 'Sara Kim',
    role: 'Asia Pacific Director',
    bio: 'Overseeing WIAL operations across Japan, Korea, and Southeast Asia.',
  },
]

const principles = [
  {
    icon: Lightbulb,
    title: 'Questions Over Statements',
    description:
      'We believe that insightful questions lead to deeper understanding and more sustainable solutions than prescriptive answers.',
  },
  {
    icon: Users,
    title: 'Diverse Perspectives',
    description:
      'Action Learning thrives when groups bring together varied backgrounds, experiences, and viewpoints.',
  },
  {
    icon: Target,
    title: 'Real Problems',
    description:
      'Learning is most effective when applied to genuine challenges that matter to participants and organizations.',
  },
  {
    icon: BookOpen,
    title: 'Reflection & Action',
    description:
      'The cycle of reflection and action creates lasting learning and measurable organizational impact.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary px-4 py-20 text-primary-foreground">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                About WIAL
              </Badge>
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Transforming Leadership Through the Power of Questions
              </h1>
              <p className="text-lg text-primary-foreground/80">
                For over 30 years, the World Institute for Action Learning has been at the
                forefront of leadership development, empowering organizations and individuals
                to solve complex problems while building lasting capabilities.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="bg-background py-20">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <Badge variant="outline" className="mb-4">
                  Our Mission
                </Badge>
                <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                  Developing Leaders Who Transform Organizations
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  WIAL&apos;s mission is to advance the use of Action Learning to develop leaders,
                  build teams, and transform organizations worldwide. We achieve this through
                  certification programs, research, and a global network of dedicated coaches.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      Certify and support Action Learning coaches globally
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      Advance Action Learning research and best practices
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      Build a global community of learning practitioners
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-primary/10 p-8">
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Globe className="mb-4 h-16 w-16 text-primary" />
                    <div className="text-4xl font-bold text-foreground">47</div>
                    <p className="text-muted-foreground">Countries with WIAL presence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section id="methodology" className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Our Methodology
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                The WIAL Action Learning Model
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our methodology is built on proven principles that have transformed thousands of
                organizations worldwide.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {principles.map((principle) => (
                <Card key={principle.title} className="border-border bg-card">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <principle.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{principle.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-12 border-primary bg-card">
              <CardContent className="p-8">
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  The Six Components of Action Learning
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      1
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">A Problem</h4>
                      <p className="text-sm text-muted-foreground">
                        Real, important, and urgent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      2
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">A Group</h4>
                      <p className="text-sm text-muted-foreground">4-8 diverse members</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      3
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">Questions</h4>
                      <p className="text-sm text-muted-foreground">
                        Reflective, insightful inquiry
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      4
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">Action</h4>
                      <p className="text-sm text-muted-foreground">
                        Commitment to implementation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      5
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">Learning</h4>
                      <p className="text-sm text-muted-foreground">
                        Individual and team growth
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      6
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">A Coach</h4>
                      <p className="text-sm text-muted-foreground">Certified AL facilitator</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* History Timeline */}
        <section id="history" className="bg-background py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Our History
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                30 Years of Transformative Impact
              </h2>
            </div>

            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative mb-8 flex items-start gap-4 md:gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
                    }`}
                  >
                    <div className="ml-10 rounded-lg border border-border bg-card p-4 md:ml-0">
                      <Badge variant="secondary" className="mb-2">
                        {item.year}
                      </Badge>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground md:left-1/2 md:-translate-x-1/2">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section id="leadership" className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Leadership
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Meet Our Global Leadership
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our leadership team brings decades of experience in Action Learning, organizational
                development, and global education.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {leadership.map((person) => (
                <Card key={person.name} className="border-border bg-card text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-2xl font-bold text-primary">
                        {person.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-foreground">{person.name}</CardTitle>
                    <CardDescription className="font-medium text-primary">
                      {person.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{person.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Join the WIAL Community
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
              Become part of a global network of Action Learning professionals dedicated to
              transforming organizations and developing leaders.
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
