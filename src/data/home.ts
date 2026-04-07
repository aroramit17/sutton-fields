import type { QuickLink, NewsItem, SpotlightFeature } from "@/types";

export const heroContent = {
  title: "Welcome to Sutton Fields",
  subtitle:
    "A master-planned community in Celina, Texas — where neighborhood living meets modern convenience. Explore events, connect with local vendors, and stay up to date with your HOA.",
  backgroundImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8kZuYiuXks9jL0K8VuiH4iP9ylNcFVuZF3BNOliVz3rSawZ875eMENqbn5ws3KxkoLeoVHxhtDDxIy9JEh8Hg4iFxP408B0_hq3V9H6SlW7YIdg7G5psAS5d5siUIgefypER_FP3zUB3ktrF1iezykb_4-UqV0rhOUTHz-28VCu2otXq-kwcLpudbhqEhqu--q03mHwB1IfmoUlBHK8qO7pLubZ8GeDl031qgLbGXurM6B8lCo4Wuiqwu98EpubwI-QKhnxNj6aI",
};

export const communityStats = {
  totalHomes: "2,289",
  hoaDues: "$550/yr",
  schoolDistrict: "Prosper ISD",
  pools: "2",
  trails: "3+ miles",
  yearEstablished: "2019",
};

export const quickLinks: QuickLink[] = [
  {
    icon: "groups",
    title: "Facebook Group",
    description:
      "Access our community archive, photo galleries, and long-form discussions with fellow Sutton Fields residents.",
    ctaLabel: "Visit Group",
    ctaHref: "#",
    variant: "default",
  },
  {
    icon: "campaign",
    title: "Resident Portal",
    description:
      "Official HOA documents, amenity bookings, and formal committee requests through Essex Management.",
    ctaLabel: "Open Portal",
    ctaHref: "https://suttonfieldshoa.com",
    variant: "accent",
  },
];

export const newsItems: NewsItem[] = [
  {
    category: "Community Update",
    title: "Sutton Fields Expansion: 450 New Homes Approved",
    excerpt:
      "Celina City Council has approved the annexation and rezoning of 110 acres for an eastern addition to Sutton Fields, bringing 450 new single-family homes in two phases.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDo4PY-spQQFkqayrP2ahVKmk1ngjcEP0v5BlQuY0r9KbVXRdytvD4NoBL2PzN_7U3vbWD9FRAYKU0Gt4Bod6hZ4XAnW6SyoU3Ys41biWUgZZOegELRJKeJkX7ZtEXDeyQB32nVvvdjpJvKNP_7EIa6MO7kJ-mBpWHOJbLL9bxJPsiIDFOEsFyx0IXbKHFgze5eEjZv0ghRJdH4SnyzpRgZVjzxyxTsZ9T8QodPBF3M-bJJfVQAsNa9ULxW3FMhqTS4lgx1Sxr3T5w",
    imageAlt:
      "Aerial view of Sutton Fields master-planned community in Celina, Texas",
    featured: true,
    href: "#",
  },
  {
    category: "Maintenance",
    title: "Spring Landscaping Guidelines Released",
    excerpt:
      "The HOA has released updated landscaping guidelines for Sutton Fields homeowners. Ensure your front lawn meets community standards before inspection season.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz5TFFWbw_N2lMMCWTn_TlYmkhpo_XhEdXnCXv168RKrtv3Yay3ljMMNIIxz3yA00acpmL-Qw7dp1uK9gwiOYuF0OUMKZBe7oJjenXNC3F0syzd23Fr54hG_ynd4TAgGb4ZgnicjC9jsWsDLEmQ3xLNPVFCsYZxIb0pkv6ez0mSyrmHl2DQZqEhXs_X8DpQ5zjYAW9A1upOIIqplkDXdzszYIsEXtRqqjs2KtuHPEDyFobBGP4uiYyP5OW0y3Lbmz6qN0ECKKe8hE",
    imageAlt:
      "Landscaped front yard in Sutton Fields community, Celina TX",
    href: "#",
  },
  {
    category: "Safety",
    title: "New Street Lighting Along East Trail",
    excerpt:
      "The HOA Board has approved the installation of five new solar-powered street lamps along the east walking trail for improved evening safety.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB03_ekZhf793mYHh_W7nQy14T1yEN8Mpc2y1Ix7V3VujsN7DtrEUbWvT_IQg_URUOfVtC6GVEYcyVsZKMjMbWMNm2_NN918JH9O3izX2WJcJLaL6OGXZAkRSK9b0ARZCa4bIUDTKgC0eCT_7joPr4lwrMQ1lTUEHHV1f_nL70vmUrdNDUZoKb-QnOlY7PWDPB_rZqx35VV6gdi5N8Azs2RMcqkGNpjQDYWyudwWnA6BupKh7O1EOTGIc1HD_3vZXjAvf5E54SVxso",
    imageAlt:
      "Walking trail in Sutton Fields neighborhood at dusk with street lighting",
    href: "#",
  },
  {
    category: "Community Garden",
    title: "Seed Swap & Garden Meetup This Sunday",
    excerpt:
      "Bring your leftover seeds and extra saplings to the Sutton Fields Community Garden this Sunday afternoon. All green thumbs welcome!",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlrvbSca-O0kP_8jpusFENTQgB6ev74ObjFt8_3y8CVjoZyx2dlKbSW6atUcFLQR55EVYghS5RMCSgdr11zzZTH5Bcm1SFI8iUb3Map-9Qvhw2Nvx7LJIE_acIYprFgJbUss7NDgeKQD2jBt1OaISnFffW32aTZpbEljgFhOjFodTH8XJlrma_mNn3GqkAWqltuCwaXKle7qikDnUYStWko2J8-EVrZkuZwYDmaaptaX39tbWlnD6n8y3z80YktusoPl9lAsgvhJA",
    imageAlt:
      "Residents working in the Sutton Fields community garden in Celina, Texas",
    href: "#",
  },
];

export const spotlight: SpotlightFeature = {
  name: "Dan Christie Elementary",
  title: "Dan Christie Elementary: Our Neighborhood School",
  description:
    "Opened in 2023, Dan Christie Elementary is Prosper ISD's 17th elementary campus — built right inside Sutton Fields. Serving grades PK-5 with 760+ students, it earned a B rating from the Texas Education Agency. Having a top-rated school within walking distance is one of the reasons families choose Sutton Fields.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDZapLTIWbKRGUTbd5GfCsphI-1CELOKoNSHwykq8gBSj0ziLivLXfQnyBfskDBI9Vv4LS86V045OaL2KJG5AyCJVOrqar6G9Q0mgFRGQ9UHNnQ_CkFkxUGIj-sYsRHK0bPGxRwt5szCmVzNtG5ZbnRqm-ENmTcXFDycLXsdafCYfWAs09or8Ep8oaGyjU8vW-zwbWqUaUAhOKhC0wagBrb59gyOwoYAMHrwOBlaraseumN5C8CzjYODoxBhhjqPenchGnny8OBtyw",
  imageAlt:
    "Modern elementary school building in the Sutton Fields community",
  stats: [
    { value: "2023", label: "Year Opened" },
    { value: "760+", label: "Students" },
  ],
  href: "https://www.prosper-isd.net/christie",
};
