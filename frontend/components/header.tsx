'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, Globe, X, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (err) {}
    }

    // Load active chapters for navigation
    api.chapters.list({ status: 'active' }).then(res => {
      setChapters(res.data)
    }).catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">W</span>
          </div>
          <span className="text-xl font-semibold text-foreground">WIAL</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/about"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-primary/10 p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-foreground">
                          About WIAL
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Learn about our mission, history, and global impact in Action Learning.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/about#mission" title="Our Mission">
                    Transforming organizations through Action Learning
                  </ListItem>
                  <ListItem href="/about#methodology" title="Methodology">
                    The WIAL Action Learning approach
                  </ListItem>
                  <ListItem href="/about#leadership" title="Leadership">
                    Meet our global leadership team
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Certification</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <ListItem href="/certification" title="Overview">
                    Explore certification pathways
                  </ListItem>
                  <ListItem href="/certification#salc" title="SALC">
                    Student Action Learning Coach
                  </ListItem>
                  <ListItem href="/certification#calc" title="CALC">
                    Certified Action Learning Coach
                  </ListItem>
                  <ListItem href="/certification#malc" title="MALC">
                    Master Action Learning Coach
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/coaches" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Find a Coach
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/events" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {chapters.length > 0 && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Globe className="mr-1 h-4 w-4" />
                  Chapters
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-3">
                    {chapters.map((chapter) => (
                      <ListItem
                        key={chapter.slug}
                        href={`/${chapter.slug}`}
                        title={chapter.name}
                      >
                        {chapter.region}
                      </ListItem>
                    ))}
                    <li className="col-span-full">
                      <Link
                        href="/chapters"
                        className="block text-sm font-medium text-primary hover:underline"
                      >
                        View all chapters →
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            {chapters.length === 0 && (
              <NavigationMenuItem>
                <Link href="/chapters" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Chapters
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {!user ? (
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild className="hidden sm:inline-flex gap-2">
              <Link href="/dashboard">
                <User className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/certification">Get Certified</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="font-bold text-primary-foreground">W</span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">WIAL</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="mt-6 flex flex-col gap-4">
                <Link
                  href="/about"
                  className="text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/certification"
                  className="text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Certification
                </Link>
                <Link
                  href="/coaches"
                  className="text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Find a Coach
                </Link>
                <Link
                  href="/events"
                  className="text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Events
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
                {!user ? (
                  <Link
                    href="/login"
                    className="text-lg font-medium text-foreground hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-lg font-medium text-foreground hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="border-t border-border pt-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Chapters</p>
                  <div className="flex flex-col gap-2">
                    {chapters.length > 0 ? chapters.map((chapter) => (
                      <Link
                        key={chapter.slug}
                        href={`/${chapter.slug}`}
                        className="text-foreground hover:text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        {chapter.name}
                      </Link>
                    )) : (
                      <Link
                        href="/chapters"
                        className="text-foreground hover:text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        Browse all chapters
                      </Link>
                    )}
                  </div>
                </div>
                <Button asChild className="mt-4">
                  <Link href="/certification" onClick={() => setMobileOpen(false)}>
                    Get Certified
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { href: string; title: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
