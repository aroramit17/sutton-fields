export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  is_approved: boolean;
  created_at: string;
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
