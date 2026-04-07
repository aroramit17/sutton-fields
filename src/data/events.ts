import type { CommunityEvent, HoaMeeting, SocialEvent } from "@/types";

export const featuredEvent: CommunityEvent = {
  id: "summer-pool-party",
  title: "Summer Kickoff Pool Party",
  description:
    "Celebrate the start of pool season at the Sutton Fields Amenity Center! Enjoy food trucks, DJ, games for kids, and the official opening of both pools for the summer.",
  date: "2026-05-23",
  dayOfWeek: "Sat",
  dayOfMonth: 23,
  month: "May",
  time: "11:00 AM",
  location: "Sutton Fields Amenity Center",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBfLqbC148n8WoQzaGHwFKh5j6X1KB2VYKqLtIXWFjsR7sO6cAwKnpXFxR4P3ASvalEev7IxQCRFpQzJe_NfcprJo-7rCp6N__K6BD_RG6AQF2nLmZaCY9Emcyz8H_DZq3R41ALOgYOYPtXtrpBZoQxfaWkm1lermGJuCGNxjObFWqZ0hSMWO_nZCPAjNmtYjNxhGniOvvZ1-omwHIqaIr60kDEMcQl-Os2hmTYQj5D90H4X_PWmxxBoXcu_v9b_ZzBnp53H9a_UDE",
  imageAlt:
    "Community pool party at Sutton Fields Amenity Center in Celina, Texas",
  featured: true,
};

export const weekEvents: CommunityEvent[] = [
  {
    id: "run-club",
    title: "Saturday Morning Run Club",
    description:
      "3.5 mile scenic loop on the Sutton Fields walking trails. All paces welcome — meet at the Amenity Center.",
    date: "2026-04-11",
    dayOfWeek: "Sat",
    dayOfMonth: 11,
    month: "Apr",
    time: "7:30 AM",
    location: "Amenity Center Trailhead",
  },
  {
    id: "garden-meetup",
    title: "Community Garden Workday",
    description:
      "Monthly garden workday at the Sutton Fields pocket farms. Bring gloves — tools and seeds provided.",
    date: "2026-04-12",
    dayOfWeek: "Sun",
    dayOfMonth: 12,
    month: "Apr",
    time: "9:00 AM",
    location: "Community Garden",
  },
];

export const hoaMeeting: HoaMeeting = {
  title: "Board of Directors Session",
  description:
    "Review of 2026 budget, landscape maintenance updates, and the Sutton Fields expansion timeline. Resident Q&A to follow.",
  date: "Tuesday, April 15th",
  timeRange: "7:00 PM — 8:30 PM",
  format: "Hybrid: Amenity Center & Zoom",
  agendaHref: "#",
};

export const socialEvents: SocialEvent[] = [
  {
    title: "Wine & Wisdom Evening",
    details: "Apr 18 • 7:30 PM • Amenity Center Fire Pit",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAY0dwjNaWFDlDWF0RsiM3Jzhw0Xmu7ha0HXugKlb6ovI07uor1x_4Fg4CZXQ5G1Ee7WMeVZFQVqanRvrE_KIQyWk6TMux-U5V10Wtn6DBwFdm6IUF_dattyktc30I_ILnDnrBoXVl8eGMNMBXTLrj0Xguwhfofcz132sczDMo_ZPfMHaMHshTiCLDONYBxJpZt-DuAoMPWzIyKtyFySDOoRQ4taPlQbBnzwCcABsC45vUbH4HM8JlZrquE9NP5YBKFwm-JV0u2V_E",
    imageAlt:
      "Neighbors clinking wine glasses at Sutton Fields community gathering",
  },
  {
    title: "Morning Playdate Group",
    details: "Every Wednesday • 10:00 AM • Playground #2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-c8VHx9MEf5wELeHEpEkabeG7ALorKbxoM1scnSaD_A3V78tL6zvjVBGK76jr2-Zn17hnEbsq9nN3broOYLD_Ayh4UzeAsuyrTTFv6ShMniemOvNGBtqaf0vwKVNJ9I82uOX_EwP2x610AcpE-cEeIr_4fxqFHCIe_CHM9OG4X8quMqNTUU-9wdwmIoCyyOGA_JfgemAlaQ2VVIribgMoLx58PkMuXx_tx-l77GwNHZIJ6EzINToDjoY24Ovuy5wMk-VX4KOV4dw",
    imageAlt:
      "Toddlers playing at Sutton Fields playground in Celina, Texas",
  },
];
