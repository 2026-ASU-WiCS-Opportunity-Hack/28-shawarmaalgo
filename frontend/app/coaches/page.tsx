import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { CoachSearch } from '@/components/coach-search'
import { coaches, languages, countries, specializations } from '@/lib/mock-data'

export const metadata = {
  title: 'Find a Coach - WIAL Coach Directory',
  description:
    'Search our global directory of certified Action Learning coaches. Find the perfect coach for your organization.',
}

export default function CoachesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary px-4 py-16 text-primary-foreground">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                Coach Directory
              </Badge>
              <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Find a Certified Action Learning Coach
              </h1>
              <p className="text-primary-foreground/80">
                Search our global network of certified coaches by location, language,
                specialization, or use our AI-powered search to describe exactly what you need.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-background py-12">
          <div className="container mx-auto px-4">
            <CoachSearch
              coaches={coaches}
              languages={languages}
              countries={countries}
              specializations={specializations}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
