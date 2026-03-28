import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Languages, Award, ArrowRight } from 'lucide-react'
import type { Coach } from '@/lib/types'

interface CoachCardProps {
  coach: Coach
}

export function CoachCard({ coach }: CoachCardProps) {
  const certificationColor = {
    SALC: 'bg-secondary/10 text-secondary',
    CALC: 'bg-primary/10 text-primary',
    MALC: 'bg-accent/10 text-accent',
  }

  return (
    <Card className="flex h-full flex-col border-border bg-card transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {coach.first_name.charAt(0)}
            {coach.last_name.charAt(0)}
          </div>
          <Badge className={certificationColor[coach.certification_level]}>
            <Award className="mr-1 h-3 w-3" />
            {coach.certification_level}
          </Badge>
        </div>
        <CardTitle className="mt-3 text-lg text-foreground">
          {coach.first_name} {coach.last_name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {coach.city ? `${coach.city}, ` : ''}
          {coach.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {coach.bio && (
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{coach.bio}</p>
        )}

        <div className="mb-4">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Languages className="h-3 w-3" />
            Languages
          </div>
          <div className="flex flex-wrap gap-1">
            {coach.languages.slice(0, 3).map((language) => (
              <Badge key={language} variant="outline" className="text-xs">
                {language}
              </Badge>
            ))}
            {coach.languages.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{coach.languages.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground">Specializations</div>
          <div className="flex flex-wrap gap-1">
            {coach.specializations.slice(0, 2).map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {coach.specializations.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{coach.specializations.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/coaches/${coach.id}`}>
              View Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
