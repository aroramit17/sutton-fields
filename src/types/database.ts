export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  source_url: string;
  source_title: string | null;
  image_url: string | null;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  created_by: string | null;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  expires_at: string;
  deactivated_at: string | null;
}

export interface ListingWithProfile extends Listing {
  profiles: Pick<Profile, "first_name" | "last_name"> | null;
}

export interface LostFoundPost {
  id: string;
  user_id: string;
  status: "lost" | "found";
  title: string;
  description: string;
  location: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  expires_at: string;
  deactivated_at: string | null;
}

export interface LostFoundPostWithProfile extends LostFoundPost {
  profiles: Pick<Profile, "first_name" | "last_name"> | null;
}

export interface CarpoolPost {
  id: string;
  user_id: string;
  title: string;
  description: string;
  destination: string;
  schedule: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  deactivated_at: string | null;
}

export interface CarpoolPostWithProfile extends CarpoolPost {
  profiles: Pick<Profile, "first_name" | "last_name"> | null;
}

export interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  link_label: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface DbEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  has_time: boolean;
  location: string | null;
  image_url: string | null;
  is_published: boolean;
  source: "manual" | "wilson_weekly";
  created_by: string | null;
  created_at: string;
}
