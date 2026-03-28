import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkout } from '@/components/checkout'
import { ArrowLeft, CheckCircle, Clock, Award } from 'lucide-react'
import { certificationPrograms } from '@/lib/mock-data'
import { PRODUCTS } from '@/lib/products'

interface EnrollPageProps {
  params: Promise<{ program: string }>
}

const programToProduct: Record<string, string> = {
  salc: 'salc-certification',
  calc: 'calc-certification',
  malc: 'malc-certification',
}

export async function generateMetadata({ params }: EnrollPageProps) {
  const { program } = await params
  const certProgram = certificationPrograms.find((p) => p.slug === program)

  if (!certProgram) {
    return {
      title: 'Program Not Found - WIAL',
    }
  }

  return {
    title: `Enroll in ${certProgram.name} - WIAL`,
    description: `Complete your enrollment in the ${certProgram.name} certification program.`,
  }
}

export default async function EnrollPage({ params }: EnrollPageProps) {
  const { program } = await params
  const certProgram = certificationPrograms.find((p) => p.slug === program)
  const productId = programToProduct[program]
  const product = PRODUCTS.find((p) => p.id === productId)

  if (!certProgram || !product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/certification">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Certification
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Order Summary */}
            <div>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <Badge variant="outline">{certProgram.level}</Badge>
                  </div>
                  <CardTitle className="text-2xl text-foreground">{certProgram.name}</CardTitle>
                  <CardDescription>{certProgram.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {certProgram.duration_weeks} week program
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-3 font-semibold text-foreground">What&apos;s Included:</h3>
                    <ul className="space-y-2">
                      {certProgram.requirements.slice(0, 4).map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Program Fee</span>
                      <span className="text-lg font-semibold text-foreground">
                        ${(product.priceInCents / 100).toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    If you have questions about this program or need assistance with enrollment,
                    please contact us.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/certification">View All Programs</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout */}
            <div>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Complete Your Enrollment</CardTitle>
                  <CardDescription>
                    Secure payment powered by Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Checkout productId={productId} />
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
