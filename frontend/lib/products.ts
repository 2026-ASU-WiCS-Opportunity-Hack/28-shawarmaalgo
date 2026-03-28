export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: 'certification' | 'event' | 'membership'
}

// WIAL Products Catalog
export const PRODUCTS: Product[] = [
  // Certification Programs
  {
    id: 'salc-certification',
    name: 'SALC Certification',
    description: 'Student Action Learning Coach certification program - 3-day intensive workshop',
    priceInCents: 150000, // $1,500
    category: 'certification',
  },
  {
    id: 'calc-certification',
    name: 'CALC Certification',
    description: 'Certified Action Learning Coach certification program - 12 week program',
    priceInCents: 250000, // $2,500
    category: 'certification',
  },
  {
    id: 'malc-certification',
    name: 'MALC Certification',
    description: 'Master Action Learning Coach certification program - 24 week program',
    priceInCents: 500000, // $5,000
    category: 'certification',
  },
  // Student Registration Fee (per spec: $50)
  {
    id: 'student-registration',
    name: 'Student Registration',
    description: 'WIAL student registration and enrollment fee',
    priceInCents: 5000, // $50
    category: 'membership',
  },
  // Certification Fee (per spec: $30)
  {
    id: 'certification-fee',
    name: 'Certification Processing Fee',
    description: 'One-time certification processing and credential issuance fee',
    priceInCents: 3000, // $30
    category: 'certification',
  },
  // Event Registration
  {
    id: 'salc-workshop-event',
    name: 'SALC Certification Workshop',
    description: 'Registration for SALC certification workshop event',
    priceInCents: 150000, // $1,500
    category: 'event',
  },
  {
    id: 'calc-workshop-event',
    name: 'CALC Advanced Certification',
    description: 'Registration for CALC advanced certification event',
    priceInCents: 250000, // $2,500
    category: 'event',
  },
  {
    id: 'global-conference',
    name: 'WIAL Global Conference 2026',
    description: 'Registration for the annual WIAL Global Conference',
    priceInCents: 75000, // $750
    category: 'event',
  },
  {
    id: 'african-leaders-training',
    name: 'Action Learning for African Leaders',
    description: 'Specialized training program for African leaders',
    priceInCents: 50000, // $500
    category: 'event',
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return PRODUCTS.filter((p) => p.category === category)
}
