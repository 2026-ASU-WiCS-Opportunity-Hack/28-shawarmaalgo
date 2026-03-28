import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  about: [
    { label: 'Our Mission', href: '/about#mission' },
    { label: 'Methodology', href: '/about#methodology' },
    { label: 'Leadership', href: '/about#leadership' },
    { label: 'History', href: '/about#history' },
  ],
  certification: [
    { label: 'SALC', href: '/certification#salc' },
    { label: 'CALC', href: '/certification#calc' },
    { label: 'MALC', href: '/certification#malc' },
    { label: 'Requirements', href: '/certification#requirements' },
  ],
  resources: [
    { label: 'Find a Coach', href: '/coaches' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
    { label: 'Research', href: '/research' },
  ],
  chapters: [
    { label: 'WIAL USA', href: '/usa' },
    { label: 'WIAL UK', href: '/uk' },
    { label: 'WIAL Japan', href: '/japan' },
    { label: 'View All', href: '/chapters' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">W</span>
              </div>
              <span className="text-xl font-semibold text-foreground">WIAL</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              World Institute for Action Learning. Transforming leaders and organizations through
              the power of questions.
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certification */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Certification</h3>
            <ul className="space-y-3">
              {footerLinks.certification.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chapters */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Chapters</h3>
            <ul className="space-y-3">
              {footerLinks.chapters.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} World Institute for Action Learning. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
