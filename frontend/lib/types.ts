// WIAL Types based on database schema

export type Coach = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  profile_image_url?: string
  bio?: string
  specializations: string[]
  languages: string[]
  country: string
  city?: string
  chapter_id: string
  chapter_name?: string
  certification_level: 'SALC' | 'CALC' | 'MALC'
  certification_date: string
  is_active: boolean
  linkedin_url?: string
  website_url?: string
}

export type Chapter = {
  id: string
  name: string
  slug: string
  country: string
  region: string
  description?: string
  description_local?: string
  primary_language: string
  supported_languages: string[]
  timezone: string
  currency: string
  contact_email: string
  website_url?: string
  logo_url?: string
  hero_image_url?: string
  is_active: boolean
  founded_year?: number
  member_count?: number
}

export type Event = {
  id: string
  title: string
  title_local?: string
  description?: string
  description_local?: string
  event_type: 'workshop' | 'webinar' | 'conference' | 'training' | 'meetup'
  start_date: string
  end_date?: string
  timezone: string
  location_type: 'in_person' | 'online' | 'hybrid'
  venue_name?: string
  venue_address?: string
  online_meeting_url?: string
  chapter_id: string
  chapter_name?: string
  max_attendees?: number
  current_attendees?: number
  price_amount?: number
  price_currency?: string
  is_free: boolean
  registration_deadline?: string
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  image_url?: string
}

export type CertificationProgram = {
  id: string
  name: string
  slug: string
  level: 'SALC' | 'CALC' | 'MALC'
  description: string
  requirements: string[]
  duration_weeks: number
  price_usd: number
  learning_outcomes: string[]
  prerequisites?: string[]
}

export type Testimonial = {
  id: string
  author_name: string
  author_title: string
  author_company?: string
  author_image_url?: string
  content: string
  rating?: number
  chapter_id?: string
  program_id?: string
}

export type SearchFilters = {
  query?: string
  languages?: string[]
  countries?: string[]
  certificationLevels?: ('SALC' | 'CALC' | 'MALC')[]
  specializations?: string[]
}
