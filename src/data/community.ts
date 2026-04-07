import type {
  School,
  Amenity,
  HoaDocument,
  CommunityResource,
} from "@/types";

export const communityOverview = {
  name: "Sutton Fields",
  tagline: "A Community Where Dreams Flourish",
  description:
    "Sutton Fields is a master-planned community developed by Centurion American Development Group in the rapidly growing city of Celina, Texas. With 2,289 single-family homes, resort-style amenities, and top-rated Prosper ISD schools, Sutton Fields has become one of North Texas's most sought-after neighborhoods.",
  location: {
    address: "4600 Waugh Avenue",
    city: "Celina",
    state: "TX",
    zip: "75009",
    county: "Collin County",
    coordinates: { lat: 33.3148, lng: -96.7846 },
  },
  developer: "Centurion American Development Group",
  totalHomes: 2289,
  homesPriceRange: "Mid-$500s to high-$800s",
  yearEstablished: 2019,
  nearbyHighways: ["Dallas North Tollway", "US Highway 380", "Preston Road", "FM 1385"],
  distanceFromFrisco: "15 minutes",
  distanceFromDallas: "40 minutes",
  distanceFromMcKinney: "21 miles",
  distanceFromDenton: "21 miles",
};

export const builders = [
  { name: "D.R. Horton", website: "https://www.drhorton.com/texas/dallas/celina/sutton-fields" },
  { name: "First Texas Homes", website: "https://www.firsttexashomes.com/communities/Sutton-Fields-113533" },
  { name: "Lennar", website: "#" },
  { name: "Mattamy Homes", website: "https://mattamyhomes.com/texas/dallas-fort-worth/celina/sutton-fields" },
  { name: "M/I Homes", website: "https://www.mihomes.com/new-homes/texas/dallas-fort-worth-metroplex/celina/lily-creek-at-sutton-fields" },
  { name: "Bloomfield Homes", website: "https://www.bloomfieldhomes.com/new-homes/tx/celina/sutton-fields/" },
  { name: "Pacesetter Homes", website: "#" },
  { name: "Sandlin Homes", website: "#" },
  { name: "Stonehollow Homes", website: "#" },
  { name: "Taylor Morrison", website: "#" },
  { name: "Beazer Homes", website: "#" },
  { name: "William Ryan Homes", website: "#" },
];

export const hoaDetails = {
  managementCompany: "Essex Association Management L.P.",
  officeAddress: "4570 Westgrove Drive, Suite 230, Addison, TX 75001",
  phone: "972-428-2030",
  fax: "469-342-8205",
  emergencyLine: "1-888-740-2233",
  website: "https://suttonfieldshoa.com",
  annualDues: 550,
  paymentMethods: ["ATG Pay", "CIT Property Pay", "Credit/Debit Card", "E-Check"],
};

export const schools: School[] = [
  {
    name: "Dan Christie Elementary School",
    type: "Elementary",
    gradeRange: "PK-5",
    distance: "Within Community",
    href: "https://www.prosper-isd.net/christie",
    description:
      "Prosper ISD's 17th elementary campus, opened in 2023 right inside Sutton Fields. Earned a B rating (80-89) from the Texas Education Agency. Serves 760+ students with state-of-the-art facilities.",
  },
  {
    name: "William Rushing Middle School",
    type: "Middle",
    gradeRange: "6-8",
    distance: "2.9 miles",
    href: "https://www.prosper-isd.net",
    description:
      "Part of Prosper ISD, ranked #13 Best Public School District in Texas. Offers strong academics, STEM programs, and extracurricular activities.",
  },
  {
    name: "Prosper High School",
    type: "High",
    gradeRange: "9-12",
    distance: "5.4 miles",
    href: "https://www.prosper-isd.net",
    description:
      "Home of the Eagles, offering advanced placement courses, championship athletics, and a wide range of extracurricular programs in Prosper ISD.",
  },
];

export const amenities: Amenity[] = [
  {
    icon: "pool",
    name: "Resort-Style Pools",
    description:
      "Two large swimming pools including a resort-style pool with cabanas and a dedicated lap pool. Cool off all summer at the Sutton Fields Amenity Center.",
    hours: "Seasonal (May - September)",
    status: "seasonal",
  },
  {
    icon: "water_drop",
    name: "Splash Pad",
    description:
      "Kid-friendly splash pad area at the Amenity Center — perfect for toddlers and young children to enjoy on hot Texas days.",
    hours: "Seasonal (May - September)",
    status: "seasonal",
  },
  {
    icon: "house",
    name: "Amenity Center",
    description:
      "The central hub of Sutton Fields at 4515 Westminster Ave featuring picnic areas, grilling stations, fire pit, and event space for community gatherings.",
    hours: "8 AM - 10 PM Daily",
    status: "open",
  },
  {
    icon: "hiking",
    name: "Walking Trails",
    description:
      "Over 3 miles of smartly crafted walking paths winding through the community, connecting neighborhoods to green spaces, ponds, and pocket parks.",
    status: "open",
  },
  {
    icon: "yard",
    name: "Community Garden & Pocket Farms",
    description:
      "Peaceful community gardens and pocket farms where residents can grow vegetables, herbs, and flowers. Raised bed plots available for sign-up.",
    status: "open",
  },
  {
    icon: "sports_soccer",
    name: "Playgrounds & Green Spaces",
    description:
      "Multiple playgrounds for different age groups, plus acres of open green space, scenic ponds, and pocket parks throughout the community.",
    status: "open",
  },
  {
    icon: "sports_basketball",
    name: "Basketball Court",
    description:
      "Full-size basketball court at the Sutton Fields Amenity Center for pickup games and community leagues.",
    status: "open",
  },
  {
    icon: "local_fire_department",
    name: "Fire Pit & Gathering Area",
    description:
      "Community fire pit area at the Amenity Center — perfect for evening gatherings, marshmallow roasts, and neighborhood socializing.",
    status: "open",
  },
];

export const hoaDocuments: HoaDocument[] = [
  {
    title: "HOA Bylaws",
    category: "Governance",
    date: "Updated 2024",
    href: "#",
    icon: "gavel",
  },
  {
    title: "CC&Rs (Covenants, Conditions & Restrictions)",
    category: "Governance",
    date: "Updated 2024",
    href: "#",
    icon: "description",
  },
  {
    title: "Architectural Review Guidelines",
    category: "Standards",
    date: "Updated 2024",
    href: "#",
    icon: "architecture",
  },
  {
    title: "Annual Budget Report",
    category: "Financial",
    date: "2024",
    href: "#",
    icon: "account_balance",
  },
  {
    title: "Board Meeting Minutes",
    category: "Minutes",
    date: "Most Recent",
    href: "#",
    icon: "edit_note",
  },
  {
    title: "Community Rules & Regulations",
    category: "Standards",
    date: "Updated 2024",
    href: "#",
    icon: "rule",
  },
];

export const utilities = [
  {
    name: "Electricity",
    provider: "CoServ Electric or GCEC (varies by location)",
    phone: "CoServ: 1-800-274-4104 | GCEC: 903-482-5231",
    website: "https://www.coserv.com",
    notes: "Provider depends on your specific location within Sutton Fields.",
  },
  {
    name: "Natural Gas",
    provider: "Atmos Energy (Mid-Tex Division)",
    phone: "1-800-460-3030",
    website: "https://www.atmosenergy.com",
    notes: "",
  },
  {
    name: "Water & Sewer",
    provider: "City of Celina",
    phone: "972-382-2682",
    website: "https://www.celina-tx.gov",
    notes: "",
  },
  {
    name: "Trash & Recycling",
    provider: "Community Waste Disposal (CWD)",
    phone: "",
    website: "https://www.communitywastedisposal.com/find-my-city/celina/",
    notes: "Weekly pickup. Contracted by the City of Celina.",
  },
  {
    name: "Internet & Cable",
    provider: "Multiple providers available",
    phone: "",
    website: "",
    notes: "AT&T Fiber, Spectrum, and other providers serve the Celina area.",
  },
];

export const communityResources: CommunityResource[] = [
  {
    icon: "emergency",
    title: "Emergency Services",
    description:
      "Celina Police non-emergency: 972-382-3811. Fire Department: 972-382-3500. For emergencies, always call 911.",
    href: "tel:911",
    category: "Safety",
  },
  {
    icon: "delete",
    title: "Trash & Recycling",
    description:
      "Community Waste Disposal handles weekly collection. Visit the City of Celina website for pickup schedules and bulk item guidelines.",
    href: "https://www.celina-tx.gov/1140/Trash-Recycling",
    category: "Services",
  },
  {
    icon: "bolt",
    title: "Utility Providers",
    description:
      "CoServ/GCEC for electric, Atmos Energy for gas, City of Celina for water/sewer. See our utility guide for setup details.",
    href: "#utilities",
    category: "Services",
  },
  {
    icon: "location_city",
    title: "City of Celina",
    description:
      "Official city services, permits, building codes, and municipal information for Celina, TX.",
    href: "https://www.celina-tx.gov",
    category: "Government",
  },
  {
    icon: "phone",
    title: "HOA Management — Essex",
    description:
      "Essex Association Management: 972-428-2030. After-hours emergency: 1-888-740-2233. Office at 4570 Westgrove Dr, Addison.",
    href: "https://suttonfieldshoa.com/contact-us.aspx",
    category: "HOA",
  },
  {
    icon: "school",
    title: "Prosper ISD",
    description:
      "Ranked #13 Best Public School District in Texas. Dan Christie Elementary is located within Sutton Fields.",
    href: "https://www.prosper-isd.net",
    category: "Education",
  },
];

export const nearbyAttractions = [
  {
    name: "Celina Historic Town Square",
    description: "Restaurants, shops, Friday Night Markets, and community movie nights on Main Street.",
    distance: "5 min drive",
  },
  {
    name: "Gentle Creek Golf Course",
    description: "18-hole championship golf course designed by D.A. Weibring.",
    distance: "10 min drive",
  },
  {
    name: "Frontier Park & Old Celina Park",
    description: "City parks with playgrounds, sports fields, picnic areas, and walking paths.",
    distance: "5-10 min drive",
  },
  {
    name: "H-E-B & Costco",
    description: "Major grocery and retail shopping along the Highway 380 corridor.",
    distance: "10-15 min drive",
  },
  {
    name: "Lake Ray Roberts",
    description: "State park with boating, fishing, swimming beaches, and camping.",
    distance: "25 min drive",
  },
  {
    name: "Lake Lewisville",
    description: "Popular lake for water sports, fishing, and lakeside dining.",
    distance: "20 min drive",
  },
];
