export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface QuickLink {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  variant: "default" | "accent";
}

export interface NewsItem {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  href: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  rating: number;
  category: string;
  verified?: boolean;
  residentOwned?: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  time: string;
  location: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
}

export interface HoaMeeting {
  title: string;
  description: string;
  date: string;
  timeRange: string;
  format: string;
  agendaHref?: string;
}

export interface SocialEvent {
  title: string;
  details: string;
  image: string;
  imageAlt: string;
}

export interface School {
  name: string;
  type: string;
  gradeRange: string;
  distance?: string;
  href: string;
  description: string;
}

export interface Amenity {
  icon: string;
  name: string;
  description: string;
  hours?: string;
  status?: "open" | "closed" | "seasonal";
}

export interface HoaDocument {
  title: string;
  category: string;
  date: string;
  href: string;
  icon: string;
}

export interface CommunityResource {
  icon: string;
  title: string;
  description: string;
  href: string;
  category: string;
}

export interface SpotlightFeature {
  name: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  stats: { value: string; label: string }[];
  href: string;
}
