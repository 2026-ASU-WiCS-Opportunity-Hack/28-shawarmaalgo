'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CoachCard } from '@/components/coach-card'
import { Search, Filter, X, Sparkles } from 'lucide-react'
import type { Coach } from '@/lib/types'

interface CoachSearchProps {
  coaches: Coach[]
  languages: string[]
  countries: string[]
  specializations: string[]
}

export function CoachSearch({
  coaches,
  languages,
  countries,
  specializations,
}: CoachSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([])
  const [isAISearch, setIsAISearch] = useState(false)

  const filteredCoaches = useMemo(() => {
    return coaches.filter((coach) => {
      // Text search
      if (query) {
        const searchQuery = query.toLowerCase()
        const matchesText =
          coach.first_name.toLowerCase().includes(searchQuery) ||
          coach.last_name.toLowerCase().includes(searchQuery) ||
          coach.bio?.toLowerCase().includes(searchQuery) ||
          coach.specializations.some((s) => s.toLowerCase().includes(searchQuery)) ||
          coach.languages.some((l) => l.toLowerCase().includes(searchQuery)) ||
          coach.country.toLowerCase().includes(searchQuery) ||
          coach.city?.toLowerCase().includes(searchQuery)

        if (!matchesText) return false
      }

      // Language filter
      if (
        selectedLanguages.length > 0 &&
        !selectedLanguages.some((lang) => coach.languages.includes(lang))
      ) {
        return false
      }

      // Country filter
      if (selectedCountries.length > 0 && !selectedCountries.includes(coach.country)) {
        return false
      }

      // Certification filter
      if (
        selectedCertifications.length > 0 &&
        !selectedCertifications.includes(coach.certification_level)
      ) {
        return false
      }

      // Specialization filter
      if (
        selectedSpecializations.length > 0 &&
        !selectedSpecializations.some((spec) => coach.specializations.includes(spec))
      ) {
        return false
      }

      return true
    })
  }, [
    coaches,
    query,
    selectedLanguages,
    selectedCountries,
    selectedCertifications,
    selectedSpecializations,
  ])

  const clearFilters = () => {
    setQuery('')
    setSelectedLanguages([])
    setSelectedCountries([])
    setSelectedCertifications([])
    setSelectedSpecializations([])
  }

  const hasActiveFilters =
    query ||
    selectedLanguages.length > 0 ||
    selectedCountries.length > 0 ||
    selectedCertifications.length > 0 ||
    selectedSpecializations.length > 0

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Languages */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Languages</h3>
        <div className="space-y-2">
          {languages.map((language) => (
            <div key={language} className="flex items-center gap-2">
              <Checkbox
                id={`lang-${language}`}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLanguages([...selectedLanguages, language])
                  } else {
                    setSelectedLanguages(selectedLanguages.filter((l) => l !== language))
                  }
                }}
              />
              <Label htmlFor={`lang-${language}`} className="text-sm text-muted-foreground">
                {language}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Countries */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Country</h3>
        <div className="space-y-2">
          {countries.map((country) => (
            <div key={country} className="flex items-center gap-2">
              <Checkbox
                id={`country-${country}`}
                checked={selectedCountries.includes(country)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCountries([...selectedCountries, country])
                  } else {
                    setSelectedCountries(selectedCountries.filter((c) => c !== country))
                  }
                }}
              />
              <Label htmlFor={`country-${country}`} className="text-sm text-muted-foreground">
                {country}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Level */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Certification Level</h3>
        <div className="space-y-2">
          {['SALC', 'CALC', 'MALC'].map((cert) => (
            <div key={cert} className="flex items-center gap-2">
              <Checkbox
                id={`cert-${cert}`}
                checked={selectedCertifications.includes(cert)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCertifications([...selectedCertifications, cert])
                  } else {
                    setSelectedCertifications(selectedCertifications.filter((c) => c !== cert))
                  }
                }}
              />
              <Label htmlFor={`cert-${cert}`} className="text-sm text-muted-foreground">
                {cert}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Specializations */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Specializations</h3>
        <Select
          value={selectedSpecializations[0] || ''}
          onValueChange={(value) => {
            if (value && !selectedSpecializations.includes(value)) {
              setSelectedSpecializations([...selectedSpecializations, value])
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Add specialization..." />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSpecializations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedSpecializations.map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedSpecializations(selectedSpecializations.filter((s) => s !== spec))
                }
              >
                {spec}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                isAISearch
                  ? 'Describe what you are looking for... (e.g., "coach who speaks Japanese and specializes in startup coaching")'
                  : 'Search by name, location, language, or specialization...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={isAISearch ? 'default' : 'outline'}
              onClick={() => setIsAISearch(!isAISearch)}
              className="shrink-0"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Search
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="shrink-0 lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedLanguages.length +
                        selectedCountries.length +
                        selectedCertifications.length +
                        selectedSpecializations.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isAISearch && (
          <p className="mt-2 text-sm text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" />
            AI-powered search understands natural language queries across languages. Try
            searching in your native language!
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <Card className="sticky top-24 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                Filters
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredCoaches.length} coach{filteredCoaches.length !== 1 ? 'es' : ''} found
            </p>
          </div>

          {filteredCoaches.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="py-12 text-center">
                <p className="mb-2 text-lg font-medium text-foreground">No coaches found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find coaches.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
