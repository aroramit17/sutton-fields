import type { NavLink } from "@/types";

// Section slugs map to --color-section-* tokens for the masthead underlines.
export const navLinks: (NavLink & { section?: string })[] = [
  { label: "News", href: "/news", section: "news" },
  { label: "Events", href: "/events", section: "events" },
  { label: "Answers", href: "/answers", section: "answers" },
  { label: "Directory", href: "/directory", section: "directory" },
  { label: "Classifieds", href: "/classifieds", section: "classifieds" },
  { label: "New Here?", href: "/new-here" },
];

export const footerLinks: NavLink[] = [
  { label: "HOA Bylaws", href: "/new-here#documents" },
  { label: "Contact Committee", href: "https://suttonfieldshoa.com/contact-us.aspx" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Resident Portal", href: "https://suttonfieldshoa.com" },
];
