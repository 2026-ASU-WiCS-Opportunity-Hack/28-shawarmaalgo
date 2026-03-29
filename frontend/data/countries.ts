export type Coach = {
  name: string;
  certification: "CALC" | "PALC" | "SALC" | "MALC";
  location: string;
  focus: string;
  bio: string;
};

export type CountryPageData = {
  slug: string;
  name: string;
  shortName: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  overview: string;
  contact: {
    email: string;
    phone: string;
    city: string;
    website?: string;
  };
  team: Array<{ name: string; role: string; blurb: string }>;
  coaches: Coach[];
  events: Array<{ title: string; date: string; location: string; summary: string }>;
  resources: Array<{ title: string; type: string; summary: string; url?: string }>;
  testimonials: Array<{ quote: string; name: string; role: string }>;
};

export const countries: CountryPageData[] = [
  {
    slug: "nigeria",
    name: "WIAL Nigeria",
    shortName: "Nigeria",
    hero: {
      eyebrow: "Official WIAL chapter",
      title: "Action Learning for organizations, leaders, and teams across Nigeria",
      description:
        "WIAL Nigeria extends the global WIAL mission locally by promoting Action Learning, supporting coach development, and making local expertise easier to discover."
    },
    overview:
      "WIAL Nigeria is the official Nigeria chapter of the World Institute for Action Learning. It helps organizations strengthen collaboration, solve complex business challenges, and develop leaders through Action Learning programs, events, and certified coaches.",
    contact: {
      email: "nigeria@wial.org",
      phone: "+234 702 500 0158",
      city: "Lagos, Nigeria"
    },
    team: [
      {
        name: "Chapter Director",
        role: "Affiliate Lead",
        blurb: "Leads chapter operations, partnerships, and local growth for WIAL in Nigeria."
      },
      {
        name: "Program Lead",
        role: "Certification Programs",
        blurb: "Coordinates certification pathways, information sessions, and chapter learning experiences."
      },
      {
        name: "Community Lead",
        role: "Coach Engagement",
        blurb: "Supports local coaches, profile quality, chapter communications, and member visibility."
      }
    ],
    coaches: [
      {
        name: "Adaeze Okafor",
        certification: "SALC",
        location: "Lagos",
        focus: "Leadership development and team performance",
        bio: "Supports organizations that want stronger collaboration, sharper questioning, and practical problem solving."
      },
      {
        name: "Tunde Adebayo",
        certification: "PALC",
        location: "Abuja",
        focus: "Public sector transformation",
        bio: "Works with complex stakeholder environments where teams need better dialogue, alignment, and execution."
      },
      {
        name: "Ngozi Eze",
        certification: "CALC",
        location: "Port Harcourt",
        focus: "Emerging leaders and team effectiveness",
        bio: "Facilitates Action Learning experiences that improve communication, accountability, and performance."
      }
    ],
    events: [
      {
        title: "Action Learning Introduction Session",
        date: "May 12, 2026",
        location: "Virtual",
        summary: "A chapter event introducing the WIAL methodology and how organizations in Nigeria can apply it."
      },
      {
        title: "CALC Information Session",
        date: "June 3, 2026",
        location: "Lagos",
        summary: "An overview of certification expectations, program structure, and next steps for prospective coaches."
      }
    ],
    resources: [
      {
        title: "Action Learning Starter Guide",
        type: "Guide",
        summary: "A quick orientation to the WIAL method, its components, and how teams use it to address real challenges."
      },
      {
        title: "Nigeria Chapter FAQ",
        type: "FAQ",
        summary: "Answers to common questions about local events, coach visibility, and engaging with WIAL Nigeria."
      }
    ],
    testimonials: [
      {
        quote:
          "Action Learning gave our leadership team a more disciplined way to think, ask better questions, and move from discussion to action.",
        name: "Regional Talent Lead",
        role: "Client organization"
      },
      {
        quote:
          "The WIAL approach created a safe environment for our team to share real challenges and learn together while solving them.",
        name: "Business Unit Leader",
        role: "Client organization"
      }
    ]
  },
  {
    slug: "usa",
    name: "WIAL USA",
    shortName: "USA",
    hero: {
      eyebrow: "Official WIAL chapter",
      title: "A chapter experience designed for local relevance and global consistency",
      description:
        "WIAL USA demonstrates how the same shared platform can support another chapter with its own coaches, events, and resources."
    },
    overview:
      "WIAL USA demonstrates the reusable chapter model, making it easy to launch and maintain chapter pages while preserving shared WIAL structure, branding, and navigation.",
    contact: {
      email: "usa@wial.org",
      phone: "+1 202 555 0184",
      city: "Washington, DC"
    },
    team: [
      {
        name: "Chapter Director",
        role: "Affiliate Lead",
        blurb: "Leads local programming and coordination with the global WIAL network."
      },
      {
        name: "Operations Manager",
        role: "Chapter Operations",
        blurb: "Oversees chapter publishing workflows, events, and member support."
      }
    ],
    coaches: [
      {
        name: "Jordan Blake",
        certification: "MALC",
        location: "Chicago",
        focus: "Executive team development",
        bio: "Helps organizations navigate strategic and organizational challenges through Action Learning."
      },
      {
        name: "Morgan Lee",
        certification: "PALC",
        location: "Seattle",
        focus: "Cross-functional collaboration",
        bio: "Supports teams that need stronger communication, reflection, and coordinated action."
      }
    ],
    events: [
      {
        title: "National Chapter Meetup",
        date: "July 15, 2026",
        location: "Virtual",
        summary: "A chapter-wide event focused on practice sharing, chapter updates, and coach networking."
      }
    ],
    resources: [
      {
        title: "US Chapter Welcome Pack",
        type: "Guide",
        summary: "A sample resource showing how local chapter documents fit within the shared content model."
      }
    ],
    testimonials: [
      {
        quote: "The shared platform makes local chapter visibility stronger without fragmenting the brand.",
        name: "Corporate Learning Partner",
        role: "Partner organization"
      }
    ]
  }
];

export const countrySubnav = [
  { label: "Overview", segment: "" },
  { label: "Team", segment: "team" },
  { label: "Coaches", segment: "coaches" },
  { label: "Events", segment: "events" },
  { label: "Resources", segment: "resources" },
  { label: "Contact", segment: "contact" }
];

export function getCountryBySlug(slug: string) {
  return countries.find((country) => country.slug === slug);
}
