export interface NewcomerStep {
  icon: string;
  title: string;
  description: string;
}

export const newcomerSteps: NewcomerStep[] = [
  {
    icon: "groups",
    title: "Join the community WhatsApp group",
    description:
      "Ask any neighbor for an invite, or check the Connect page for the current group links, including school- and grade-specific sub-groups.",
  },
  {
    icon: "how_to_reg",
    title: "Register with the HOA",
    description:
      "Contact Essex Association Management (972-428-2030) to confirm your account is set up and dues are current — see Live Here > HOA Documents for details.",
  },
  {
    icon: "pool",
    title: "Request pool & amenity access",
    description:
      "Amenity access runs through the Paxton app. Check your email from the HOA for the request link — approval has been taking one to three weeks, so apply as soon as you move in.",
  },
  {
    icon: "school",
    title: "Get connected with your school",
    description:
      "Dan Christie Elementary sits inside the community; Rushing Middle and Prosper High are a short drive. See Live Here > Schools, and ask in Connect for your grade's carpool or parent group.",
  },
  {
    icon: "storefront",
    title: "Browse trusted vendors",
    description:
      "Before searching outside the neighborhood, check Get Help > Vendors — most home-service needs already have a resident-recommended provider.",
  },
];
