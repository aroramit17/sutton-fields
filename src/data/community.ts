import type {
  School,
  Amenity,
  HoaDocument,
  CommunityResource,
} from "@/types";

export const schools: School[] = [
  {
    name: "Prosper Elementary",
    type: "Elementary",
    gradeRange: "PK-5",
    distance: "0.5 miles",
    href: "#",
    description:
      "Our neighborhood elementary school, known for its strong STEM programs and community involvement.",
  },
  {
    name: "Reynolds Middle School",
    type: "Middle",
    gradeRange: "6-8",
    distance: "1.2 miles",
    href: "#",
    description:
      "Serving our community with excellent academics and extracurricular programs.",
  },
  {
    name: "Prosper High School",
    type: "High",
    gradeRange: "9-12",
    distance: "2.4 miles",
    href: "#",
    description:
      "Home of the Eagles, offering advanced placement courses and championship athletics.",
  },
];

export const amenities: Amenity[] = [
  {
    icon: "pool",
    name: "Community Pool",
    description: "Resort-style pool with lap lanes, splash pad, and shaded cabanas.",
    hours: "6 AM - 9 PM (Seasonal)",
    status: "seasonal",
  },
  {
    icon: "house",
    name: "The Clubhouse",
    description:
      "Event space available for private bookings, meetings, and community gatherings.",
    hours: "8 AM - 10 PM Daily",
    status: "open",
  },
  {
    icon: "hiking",
    name: "Walking Trails",
    description:
      "Over 3 miles of paved and natural trails winding through the neighborhood.",
    status: "open",
  },
  {
    icon: "sports_soccer",
    name: "Playground & Fields",
    description:
      "Two playgrounds for different age groups plus open fields for pickup games.",
    status: "open",
  },
  {
    icon: "pets",
    name: "Dog Park",
    description:
      "Fenced off-leash area with separate sections for large and small breeds.",
    hours: "Dawn - Dusk",
    status: "open",
  },
  {
    icon: "yard",
    name: "Community Garden",
    description:
      "Raised bed plots available for residents. Sign up at the Clubhouse front desk.",
    status: "open",
  },
];

export const hoaDocuments: HoaDocument[] = [
  {
    title: "HOA Bylaws",
    category: "Governance",
    date: "Updated Jan 2024",
    href: "#",
    icon: "gavel",
  },
  {
    title: "CC&Rs (Covenants, Conditions & Restrictions)",
    category: "Governance",
    date: "Updated Jan 2024",
    href: "#",
    icon: "description",
  },
  {
    title: "Architectural Guidelines",
    category: "Standards",
    date: "Updated Mar 2024",
    href: "#",
    icon: "architecture",
  },
  {
    title: "2024 Annual Budget Report",
    category: "Financial",
    date: "Published Feb 2024",
    href: "#",
    icon: "account_balance",
  },
  {
    title: "Board Meeting Minutes - March 2024",
    category: "Minutes",
    date: "Mar 2024",
    href: "#",
    icon: "edit_note",
  },
];

export const communityResources: CommunityResource[] = [
  {
    icon: "emergency",
    title: "Emergency Contacts",
    description: "Police non-emergency, fire department, and utility emergency lines.",
    href: "#",
    category: "Safety",
  },
  {
    icon: "delete",
    title: "Trash & Recycling Schedule",
    description: "Collection days, bulk pickup dates, and recycling guidelines.",
    href: "#",
    category: "Services",
  },
  {
    icon: "bolt",
    title: "Utility Providers",
    description: "Electric, water, gas, and internet service providers for our area.",
    href: "#",
    category: "Services",
  },
  {
    icon: "location_city",
    title: "Town of Prosper",
    description: "Official city services, permits, and municipal information.",
    href: "#",
    category: "Government",
  },
];
