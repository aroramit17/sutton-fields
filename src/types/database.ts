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
