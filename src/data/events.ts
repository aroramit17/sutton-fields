import type { CommunityEvent, HoaMeeting, SocialEvent } from "@/types";

export const featuredEvent: CommunityEvent = {
  id: "harvest-moon-dinner",
  title: "Annual Harvest Moon Dinner",
  description:
    "Join us for an evening under the stars with locally sourced dishes and live acoustic music from our very own neighborhood residents.",
  date: "2024-10-24",
  dayOfWeek: "Thu",
  dayOfMonth: 24,
  month: "Oct",
  time: "6:00 PM",
  location: "The Commons Lawn",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBfLqbC148n8WoQzaGHwFKh5j6X1KB2VYKqLtIXWFjsR7sO6cAwKnpXFxR4P3ASvalEev7IxQCRFpQzJe_NfcprJo-7rCp6N__K6BD_RG6AQF2nLmZaCY9Emcyz8H_DZq3R41ALOgYOYPtXtrpBZoQxfaWkm1lermGJuCGNxjObFWqZ0hSMWO_nZCPAjNmtYjNxhGniOvvZ1-omwHIqaIr60kDEMcQl-Os2hmTYQj5D90H4X_PWmxxBoXcu_v9b_ZzBnp53H9a_UDE",
  imageAlt:
    "A beautifully decorated community banquet table in a lush green garden at twilight with fairy lights",
  featured: true,
};

export const weekEvents: CommunityEvent[] = [
  {
    id: "run-club",
    title: "Saturday Morning Run Club",
    description:
      "3.5 Mile scenic loop around the lake. All paces welcome.",
    date: "2024-10-26",
    dayOfWeek: "Sat",
    dayOfMonth: 26,
    month: "Oct",
    time: "08:00 AM",
    location: "Lake Trailhead",
  },
  {
    id: "pumpkin-carving",
    title: "Pumpkin Carving Workshop",
    description:
      "Family friendly event at the clubhouse. We provide the tools!",
    date: "2024-10-27",
    dayOfWeek: "Sun",
    dayOfMonth: 27,
    month: "Oct",
    time: "02:00 PM",
    location: "Clubhouse Patio",
  },
];

export const hoaMeeting: HoaMeeting = {
  title: "Board of Directors Session",
  description:
    "Review of upcoming landscape improvements and 2025 budget overview. Resident Q&A to follow.",
  date: "Tuesday, Nov 5th",
  timeRange: "7:00 PM — 8:30 PM",
  format: "Hybrid: Clubhouse & Zoom",
  agendaHref: "#",
};

export const socialEvents: SocialEvent[] = [
  {
    title: "Wine & Wisdom Evening",
    details: "Nov 12 • 7:30 PM • 142 Birch Dr.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAY0dwjNaWFDlDWF0RsiM3Jzhw0Xmu7ha0HXugKlb6ovI07uor1x_4Fg4CZXQ5G1Ee7WMeVZFQVqanRvrE_KIQyWk6TMux-U5V10Wtn6DBwFdm6IUF_dattyktc30I_ILnDnrBoXVl8eGMNMBXTLrj0Xguwhfofcz132sczDMo_ZPfMHaMHshTiCLDONYBxJpZt-DuAoMPWzIyKtyFySDOoRQ4taPlQbBnzwCcABsC45vUbH4HM8JlZrquE9NP5YBKFwm-JV0u2V_E",
    imageAlt:
      "Overhead view of several people clinking wine glasses over a table filled with appetizers",
  },
  {
    title: "Morning Playdate Group",
    details: "Every Wednesday • 10:00 AM",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-c8VHx9MEf5wELeHEpEkabeG7ALorKbxoM1scnSaD_A3V78tL6zvjVBGK76jr2-Zn17hnEbsq9nN3broOYLD_Ayh4UzeAsuyrTTFv6ShMniemOvNGBtqaf0vwKVNJ9I82uOX_EwP2x610AcpE-cEeIr_4fxqFHCIe_CHM9OG4X8quMqNTUU-9wdwmIoCyyOGA_JfgemAlaQ2VVIribgMoLx58PkMuXx_tx-l77GwNHZIJ6EzINToDjoY24Ovuy5wMk-VX4KOV4dw",
    imageAlt:
      "A group of toddlers playing together on a colorful play mat in a bright, modern room",
  },
];
