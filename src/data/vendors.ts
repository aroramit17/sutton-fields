import type { Vendor } from "@/types";

// Real vendors compiled from the Sutton Fields residents' shared
// service-contracts spreadsheet and Facebook group recommendation threads
// (Aug 2026). Recommender names are deliberately omitted; pricing notes are
// what residents reported at the time and will drift. The Directory page
// shows a do-your-own-verification disclaimer.

export const vendorCategories = [
  "All",
  "Lawn & Landscape",
  "Pest Control",
  "Electrical",
  "Handyman",
  "Home Inspection",
  "Garage & Floors",
  "Cleaning",
  "Water Softeners",
  "Events & Rentals",
  "Photography & Decor",
  "Classes",
  "Real Estate & Notary",
  "Wildlife",
];

export const vendors: Vendor[] = [
  {
    id: "military-lawn-cuts",
    name: "Military Lawn Cuts",
    category: "Lawn & Landscape",
    website: "https://www.militarylawncuts.com",
    description:
      "Fertilization and weed control. Residents report about $97 per round including tax on an 8-round yearly program.",
  },
  {
    id: "emmanuel-gomez-lawn",
    name: "Emmanuel Gomez Lawn Care",
    category: "Lawn & Landscape",
    phone: "214-529-8723",
    description: "Lawn mowing recommended by Sutton Fields neighbors.",
  },
  {
    id: "cipriano-alvarez",
    name: "Cipriano Alvarez",
    category: "Lawn & Landscape",
    phone: "214-286-2923",
    description:
      "Flower bed construction and landscaping. A resident reported a front-yard flower bed with two trees for $1,200, built on a cement foundation to resist cracking.",
  },
  {
    id: "safe-tech-pest",
    name: "Safe Tech Pest Control",
    category: "Pest Control",
    phone: "972-330-2888",
    description:
      "Quarterly pest control; ask for James. Residents report about $107 per visit including tax on an every-3-months plan.",
  },
  {
    id: "clutch-pest",
    name: "Clutch Pest Control",
    category: "Pest Control",
    phone: "214-620-0992",
    description: "Pest control recommended by Sutton Fields neighbors.",
  },
  {
    id: "mm-general-services",
    name: "M&M General Services (Marcello)",
    category: "Electrical",
    phone: "972-480-2742",
    description:
      "Electrician praised for quick responses and fair pricing. One resident's Eaton breaker swap came in at $79 against a $160 quote elsewhere.",
  },
  {
    id: "edwin-electric",
    name: "Edwin",
    category: "Electrical",
    phone: "469-576-0692",
    description:
      "Electrician neighbors have used for several small projects at reasonable prices with good quality.",
  },
  {
    id: "jcr-electricals",
    name: "JCR Electricals (Ivan)",
    category: "Electrical",
    phone: "214-875-3128",
    description:
      "Electrical work plus window blind installation. Residents describe quick responses, reasonable pricing, and flawless work.",
  },
  {
    id: "philip-romero",
    name: "Philip Romero",
    category: "Handyman",
    phone: "209-603-8077",
    description: "Handyman charging by the hour, about $65/hr per resident reports.",
  },
  {
    id: "douglas-handyman",
    name: "Douglas",
    category: "Handyman",
    phone: "214-687-7468",
    description:
      "Handyman and carpentry. A resident reported a staircase half-wall-to-railing conversion for $1,400 including materials, with nice results.",
  },
  {
    id: "venkat-handyman",
    name: "Venkat",
    category: "Handyman",
    phone: "864-553-5094",
    description:
      "Water softener installs, TV wall mounts, patio extensions, and custom woodwork including cupboards, closets, and puja mandirs.",
  },
  {
    id: "gilberto-alonso-epoxy",
    name: "Gilberto Alonso",
    category: "Garage & Floors",
    phone: "214-395-8575",
    description: "Garage floor epoxy, recommended through the Facebook group.",
  },
  {
    id: "flavio-epoxy",
    name: "Flavio",
    category: "Garage & Floors",
    phone: "214-978-7309",
    description:
      "Garage floor epoxy; quoted a resident about $1,200 for a 2-car garage.",
  },
  {
    id: "garage-door-repair",
    name: "Garage Door Repair",
    category: "Garage & Floors",
    phone: "214-728-3555",
    description:
      "Garage door repair. A resident reported very good work at a lower quote than competitors.",
  },
  {
    id: "ron-lane-inspection",
    name: "Ron Lane",
    category: "Home Inspection",
    phone: "972-742-9978",
    description:
      "Home inspection: about $400 for a 2,700 sqft home including sprinkler check and thermal imaging.",
  },
  {
    id: "stephen-inspection",
    name: "Stephen",
    category: "Home Inspection",
    phone: "214-417-0782",
    description: "Home inspector who provides a detailed report of issues found.",
  },
  {
    id: "home-inspectors-tx",
    name: "The Home Inspectors TX",
    category: "Home Inspection",
    website: "https://thehomeinspectorstx.com/",
    description:
      "One resident's inspector spent 6 hours and delivered a 40-page report with images that went straight to the builder's punch list. Charged by square footage under roof.",
  },
  {
    id: "lorena-cleaning",
    name: "Lorena",
    category: "Cleaning",
    phone: "972-822-4634",
    description:
      "Home cleaning; also offers free notary service to the community.",
  },
  {
    id: "cleaning-sisters",
    name: "Cleaning Sisters",
    category: "Cleaning",
    phone: "469-235-5534",
    description: "Home cleaning recommended by Sutton Fields neighbors.",
  },
  {
    id: "randy-water-softener",
    name: "Randy",
    category: "Water Softeners",
    phone: "832-466-7723",
    description: "Water softener sales and installation, recommended by many group members.",
  },
  {
    id: "prabhakar-rentals",
    name: "Prabhakar Party Rentals",
    category: "Events & Rentals",
    phone: "651-278-8768",
    description:
      "One stop for party rentals: chairs, tables, lights, fans, canopies, heaters, and table cloths. Many residents report very good service.",
  },
  {
    id: "venu-rentals",
    name: "Venu",
    category: "Events & Rentals",
    phone: "469-592-9262",
    description:
      "Chairs and tables: about $1 per chair and $8 per table, delivery extra. Professional and on time per residents.",
  },
  {
    id: "chandu-rentals",
    name: "Chandu",
    category: "Events & Rentals",
    phone: "410-422-2034",
    description:
      "Rentals: $1 chairs, $7 round tables, $5 serving tables, chair covers with bows, table cloths and runners. Delivery extra.",
  },
  {
    id: "jp-photography",
    name: "JP Photography",
    category: "Photography & Decor",
    phone: "201-685-2494",
    website: "https://www.facebook.com/portraitsbyjp",
    description:
      "Event photography: housewarmings, birthdays, family portraits, baby showers, and newborn sessions.",
  },
  {
    id: "madhu-latha-decor",
    name: "Madhu Latha",
    category: "Photography & Decor",
    phone: "214-454-6816",
    description:
      "Party decorations. A resident describes creative, reasonably priced decor for a baby shower and birthday party.",
  },
  {
    id: "mayin-by-asha",
    name: "Mayin Events by Asha",
    category: "Photography & Decor",
    phone: "505-675-0682",
    website: "https://instagram.com/mayin_by_asha",
    description: "Event decoration for parties and celebrations.",
  },
  {
    id: "himanshi-yoga",
    name: "Himanshi Yoga",
    category: "Classes",
    phone: "267-437-8452",
    description:
      "Yoga classes for adults, including prenatal and postnatal, plus classes for kids.",
  },
  {
    id: "venkata-vejandla",
    name: "Venkata Vejandla",
    category: "Real Estate & Notary",
    phone: "469-901-6945",
    description:
      "Realtor and lending services; residents call him a strong cash-back realtor for the area. Also provides notary service.",
  },
  {
    id: "anmol-snake",
    name: "Anmol (Snake Catcher)",
    category: "Wildlife",
    phone: "817-760-9317",
    description:
      "Snake removal. Good number to have saved in a Texas summer.",
  },
];
