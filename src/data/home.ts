import type { QuickLink, NewsItem, SpotlightFeature } from "@/types";

export const heroContent = {
  title: "The Modern Commons of Prosper",
  subtitle:
    "Discover neighborhood updates, connect with trusted local vendors, and stay tuned to our community calendar.",
  backgroundImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8kZuYiuXks9jL0K8VuiH4iP9ylNcFVuZF3BNOliVz3rSawZ875eMENqbn5ws3KxkoLeoVHxhtDDxIy9JEh8Hg4iFxP408B0_hq3V9H6SlW7YIdg7G5psAS5d5siUIgefypER_FP3zUB3ktrF1iezykb_4-UqV0rhOUTHz-28VCu2otXq-kwcLpudbhqEhqu--q03mHwB1IfmoUlBHK8qO7pLubZ8GeDl031qgLbGXurM6B8lCo4Wuiqwu98EpubwI-QKhnxNj6aI",
};

export const quickLinks: QuickLink[] = [
  {
    icon: "chat",
    title: "WhatsApp Hub",
    description:
      "Join the real-time conversation for street-level updates and quick neighborly help.",
    ctaLabel: "Connect Now",
    ctaHref: "#",
    variant: "default",
  },
  {
    icon: "groups",
    title: "Facebook Group",
    description:
      "Access our legacy community archive, photo galleries, and long-form discussions.",
    ctaLabel: "Visit Group",
    ctaHref: "#",
    variant: "default",
  },
  {
    icon: "campaign",
    title: "Resident Portal",
    description:
      "Official HOA documents, amenity bookings, and formal committee requests.",
    ctaLabel: "Open Portal",
    ctaHref: "#",
    variant: "accent",
  },
];

export const newsItems: NewsItem[] = [
  {
    category: "Featured Event",
    title: "Summer Solstice Social: Saturday at the Clubhouse",
    excerpt:
      "Join us for food trucks, live music, and neighborhood bonding as we celebrate the longest day of the year at our central pavilion.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDo4PY-spQQFkqayrP2ahVKmk1ngjcEP0v5BlQuY0r9KbVXRdytvD4NoBL2PzN_7U3vbWD9FRAYKU0Gt4Bod6hZ4XAnW6SyoU3Ys41biWUgZZOegELRJKeJkX7ZtEXDeyQB32nVvvdjpJvKNP_7EIa6MO7kJ-mBpWHOJbLL9bxJPsiIDFOEsFyx0IXbKHFgze5eEjZv0ghRJdH4SnyzpRgZVjzxyxTsZ9T8QodPBF3M-bJJfVQAsNa9ULxW3FMhqTS4lgx1Sxr3T5w",
    imageAlt:
      "Community gathering with diverse families on a green lawn with picnic blankets and festive summer lighting",
    featured: true,
    href: "#",
  },
  {
    category: "Maintenance",
    title: "Spring Landscaping Guidelines Released",
    excerpt:
      "Ensure your front lawn meets the new eco-friendly water standards for the upcoming season...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz5TFFWbw_N2lMMCWTn_TlYmkhpo_XhEdXnCXv168RKrtv3Yay3ljMMNIIxz3yA00acpmL-Qw7dp1uK9gwiOYuF0OUMKZBe7oJjenXNC3F0syzd23Fr54hG_ynd4TAgGb4ZgnicjC9jsWsDLEmQ3xLNPVFCsYZxIb0pkv6ez0mSyrmHl2DQZqEhXs_X8DpQ5zjYAW9A1upOIIqplkDXdzszYIsEXtRqqjs2KtuHPEDyFobBGP4uiYyP5OW0y3Lbmz6qN0ECKKe8hE",
    imageAlt:
      "Close up of vibrant green garden plants being watered in a modern residential landscape",
    href: "#",
  },
  {
    category: "Safety",
    title: "Neighborhood Watch: New Lighting Plan",
    excerpt:
      "The Committee has approved the installation of five new solar-powered street lamps along the east trail...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB03_ekZhf793mYHh_W7nQy14T1yEN8Mpc2y1Ix7V3VujsN7DtrEUbWvT_IQg_URUOfVtC6GVEYcyVsZKMjMbWMNm2_NN918JH9O3izX2WJcJLaL6OGXZAkRSK9b0ARZCa4bIUDTKgC0eCT_7joPr4lwrMQ1lTUEHHV1f_nL70vmUrdNDUZoKb-QnOlY7PWDPB_rZqx35VV6gdi5N8Azs2RMcqkGNpjQDYWyudwWnA6BupKh7O1EOTGIc1HD_3vZXjAvf5E54SVxso",
    imageAlt:
      "Modern neighborhood street with clean sidewalks and tall trees under a clear blue sky",
    href: "#",
  },
  {
    category: "Community",
    title: "Seed Swap & Garden Meetup",
    excerpt:
      "Bring your leftover seeds and extra saplings to the Community Garden this Sunday afternoon...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlrvbSca-O0kP_8jpusFENTQgB6ev74ObjFt8_3y8CVjoZyx2dlKbSW6atUcFLQR55EVYghS5RMCSgdr11zzZTH5Bcm1SFI8iUb3Map-9Qvhw2Nvx7LJIE_acIYprFgJbUss7NDgeKQD2jBt1OaISnFffW32aTZpbEljgFhOjFodTH8XJlrma_mNn3GqkAWqltuCwaXKle7qikDnUYStWko2J8-EVrZkuZwYDmaaptaX39tbWlnD6n8y3z80YktusoPl9lAsgvhJA",
    imageAlt:
      "Hands holding various potted plants and garden tools at a community table",
    href: "#",
  },
];

export const spotlight: SpotlightFeature = {
  name: "The Millers",
  title: "Meet the Millers: Pioneers of the East Trail",
  description:
    "This month we sit down with David and Sarah Miller, who have been part of the Sutton Fields family since the first stone was laid. Discover their secret to the perfect backyard garden and why they think the North Trail is the neighborhood's hidden gem.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDZapLTIWbKRGUTbd5GfCsphI-1CELOKoNSHwykq8gBSj0ziLivLXfQnyBfskDBI9Vv4LS86V045OaL2KJG5AyCJVOrqar6G9Q0mgFRGQ9UHNnQ_CkFkxUGIj-sYsRHK0bPGxRwt5szCmVzNtG5ZbnRqm-ENmTcXFDycLXsdafCYfWAs09or8Ep8oaGyjU8vW-zwbWqUaUAhOKhC0wagBrb59gyOwoYAMHrwOBlaraseumN5C8CzjYODoxBhhjqPenchGnny8OBtyw",
  imageAlt:
    "A warm and inviting modern home kitchen with natural wood accents and soft morning light through the windows",
  stats: [
    { value: "2018", label: "Residents Since" },
    { value: "12+", label: "Garden Awards" },
  ],
  href: "#",
};
