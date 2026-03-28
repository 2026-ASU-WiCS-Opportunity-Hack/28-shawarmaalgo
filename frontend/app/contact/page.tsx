'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Mail, Phone, MapPin, Globe, Clock, CheckCircle } from 'lucide-react'
import { chapters } from '@/lib/mock-data'

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'certification', label: 'Certification Information' },
  { value: 'coaching', label: 'Find a Coach' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'chapter', label: 'Start a Chapter' },
  { value: 'media', label: 'Media & Press' },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
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
                Contact Us
              </Badge>
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Get in Touch with WIAL
              </h1>
              <p className="text-primary-foreground/80">
                Have questions about Action Learning, certification, or partnerships? Our global
                team is here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">Send Us a Message</h2>

                {isSubmitted ? (
                  <Card className="border-primary bg-primary/5">
                    <CardContent className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-foreground">
                        Message Sent!
                      </h3>
                      <p className="mb-6 text-muted-foreground">
                        Thank you for reaching out. We will get back to you within 2 business
                        days.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border bg-card">
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmit}>
                        <FieldGroup>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                              <Input
                                id="firstName"
                                name="firstName"
                                placeholder="John"
                                required
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                              <Input id="lastName" name="lastName" placeholder="Doe" required />
                            </Field>
                          </div>

                          <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="john@example.com"
                              required
                            />
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="company">Company / Organization</FieldLabel>
                            <Input
                              id="company"
                              name="company"
                              placeholder="Acme Inc."
                            />
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="inquiryType">Inquiry Type</FieldLabel>
                            <Select name="inquiryType" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an inquiry type" />
                              </SelectTrigger>
                              <SelectContent>
                                {inquiryTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="chapter">Preferred Chapter (Optional)</FieldLabel>
                            <Select name="chapter">
                              <SelectTrigger>
                                <SelectValue placeholder="Select a chapter" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="global">WIAL Global</SelectItem>
                                {chapters.map((chapter) => (
                                  <SelectItem key={chapter.id} value={chapter.id}>
                                    {chapter.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="message">Message</FieldLabel>
                            <Textarea
                              id="message"
                              name="message"
                              placeholder="Tell us how we can help..."
                              rows={5}
                              required
                            />
                          </Field>

                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </FieldGroup>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">Contact Information</h2>

                <div className="space-y-6">
                  {/* Global Office */}
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">WIAL Global Office</CardTitle>
                      <CardDescription>Our headquarters and main contact point</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Address</p>
                          <p className="text-sm text-muted-foreground">
                            1234 Leadership Way, Suite 500
                            <br />
                            Washington, DC 20001, USA
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Email</p>
                          <a
                            href="mailto:info@wial.org"
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            info@wial.org
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Phone</p>
                          <a
                            href="tel:+1-202-555-0100"
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            +1 (202) 555-0100
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Business Hours</p>
                          <p className="text-sm text-muted-foreground">
                            Monday - Friday: 9:00 AM - 5:00 PM EST
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Regional Chapters */}
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">Regional Chapters</CardTitle>
                      <CardDescription>
                        Contact your local chapter for region-specific inquiries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {chapters.slice(0, 6).map((chapter) => (
                          <Link
                            key={chapter.id}
                            href={`/${chapter.slug}`}
                            className="flex items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                          >
                            <Globe className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{chapter.name}</p>
                              <p className="text-xs text-muted-foreground">{chapter.region}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Button variant="outline" className="mt-4 w-full" asChild>
                        <Link href="/chapters">View All Chapters</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Links */}
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Link
                          href="/certification"
                          className="block rounded-lg p-3 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          Certification Programs
                        </Link>
                        <Link
                          href="/coaches"
                          className="block rounded-lg p-3 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          Find a Coach
                        </Link>
                        <Link
                          href="/events"
                          className="block rounded-lg p-3 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          Upcoming Events
                        </Link>
                        <Link
                          href="/about"
                          className="block rounded-lg p-3 text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          About WIAL
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
