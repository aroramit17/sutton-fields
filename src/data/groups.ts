export interface CommunityGroup {
  name: string;
  description: string;
  href: string;
}

// NOTE: href values below are placeholders ("#"). Real WhatsApp invite
// links need to be filled in by an admin before this page is launched —
// invite links can't be fabricated and must come from an existing group admin.
export const communityGroups: CommunityGroup[] = [
  {
    name: "Sutton Fields — Main Group",
    description: "The primary neighborhood WhatsApp group for general community discussion.",
    href: "#",
  },
  {
    name: "Dan Christie Elementary Parents",
    description: "For DCE families — PTO events, carline updates, teacher assignments.",
    href: "#",
  },
  {
    name: "Rushing Middle School Parents",
    description: "For families with kids at Rushing Middle School.",
    href: "#",
  },
  {
    name: "Brenda Calhoun PreK",
    description: "For families with kids in the Prosper ISD PreK program.",
    href: "#",
  },
];

export const otherChannels = [
  {
    name: "Facebook Group",
    description: "Community discussion and announcements.",
    href: "https://www.facebook.com/groups/suttonfields/",
  },
];
