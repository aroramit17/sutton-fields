import type { Vendor } from "@/types";

export const vendorCategories = [
  "All",
  "Home Services",
  "Food & Dining",
  "Babysitting",
  "Pet Care",
];

export const vendorPageContent = {
  label: "Neighborhood Directory",
  title: "Trusted local experts for your home.",
  description:
    "Connect with community-vetted vendors serving Sutton Fields and the Celina, TX area. From landscapers to pet sitters, find trusted help right in your neighborhood.",
};

export const vendors: Vendor[] = [
  {
    id: "evergreen-estates",
    name: "Evergreen Estates",
    description:
      "Expert lawn maintenance and landscape design tailored for Sutton Fields terrain. Serving the Celina and Prosper area since 2012.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBO3C2c2doB3K2qGTtkBc1nj3ArPAfCbcfVbvgcBAx85tqJuQtxnywXTcr6LpFxiqPsbLpJF0poD5L7IvRlPk9a3WZyHc6hTlu0J5W1am5LpmXlh80kwqFjV2J8GMLZUb9zxiCFyXgCod2fy3Dyb5q-S90DckVR8XtT4u8HNUTSWrJpx2mqdzedRvAtBA0mFamuquX9jPv1grFfbjD5Jux6GTuibD8D7a78BpnNdrWmCI4cflHH4ma8C1xnnfNvASJUVXaL-pEcJew",
    imageAlt:
      "Professional landscaping team working in Sutton Fields, Celina TX",
    rating: 4.9,
    category: "Home Services",
    verified: true,
  },
  {
    id: "the-flour-mill",
    name: "The Flour Mill",
    description:
      "Small-batch artisan bakery specializing in organic sourdough and seasonal pastries. Owned by a Sutton Fields resident — delivered fresh to your door.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbFkcDf2U1E8lZ80sW1Pl4SrSn_xjyct5ExKARzPC1-wNK8qjC_XJPocZ12Lynglln6qaRsyoTI2s7uN8N0XQD_5YcGvrUjDq2kx118rRDnwKYE1rwRgxEH21I-O21ij36K9dohksXQN5gPhl7BJv3r5fImFv0R12YesqOwAU3jz7--9AC6FEi3seZ6eC1Q2u_OgKsb8p0rTa6TNilVGW4WwwDIKM_qCuf6-cpxhXXUH3sLXZhk6gvpbzp8IVyKNeV2QhRti6-gZ8",
    imageAlt:
      "Artisan bread and pastries from a Sutton Fields resident-owned bakery",
    rating: 5.0,
    category: "Food & Dining",
    residentOwned: true,
  },
  {
    id: "paws-and-paths",
    name: "Paws & Paths",
    description:
      "Reliable dog walking and in-home pet sitting on the Sutton Fields trails. CPR certified and community recommended.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOHpvvQDXd7y7zFqIqspMWq9hZ2mYu4JrNn8tR47g6EGkVhhjwQn0qFcINaTWMEFQ_bYuz_7sDrhlTyLVeyqAe_8AvYatKafG9f-icZVxDJ6TfAgAGKnPTWgN9OZJCU_c1WT1N8BuF167rBnw6hsJo34JZUXS_49Fz5_R_RtNaJcVw9v17e-L2uV1N_Xw02-NYlTvrZMLCJI95c-VP8sVXcRyENhHbHxCO8bCp8knEDhLSqY0h_AMNc1GmJ4O5mlRdoiLBFgb-bMI",
    imageAlt:
      "Dog walker on Sutton Fields walking trail in Celina, Texas",
    rating: 4.8,
    category: "Pet Care",
  },
  {
    id: "sutton-spark",
    name: "Sutton Spark",
    description:
      "Licensed residential electricians for all your smart home installations and repairs. Serving Sutton Fields and greater Celina area.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCN4rvYvAk8TCUeBZEViBtEApy0cnV4Cpe0A-TkXus_OlLQJJzbt8OvmZVtbGIxb_iLgwgm-75KAaPB-dTk91vz2dsti6jvfI1eohz0uMsmHjhQvlseRA9CAvXh18yOOSOJnN93aCFVcP0wPwvSRAg0mV-2Eyv1t4GY2AGimgFujFcjrRiJcJFn-4_AnhkmgXR8lHLBecES6zIukebAGVuixKGcjb6vjuWkHXKVgMlYwBLv58NM_czSyfszHkxyoqO6WHi2THjHxQw",
    imageAlt:
      "Electrician working on smart home installation in Sutton Fields",
    rating: 4.7,
    category: "Home Services",
    verified: true,
  },
  {
    id: "village-sitters",
    name: "Village Sitters",
    description:
      "Trusted Sutton Fields neighborhood students and parents offering evening and weekend childcare. Background-checked and community-vetted.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjbiQCmCyQlr07KayekWfPne0EG58sNdPdouiJtaf7UDFg5WY-gEI0qEkzw3DwrLwhzmB_uYD6Ghdm9w9_dJwA-c0Rrci8OProKf3U-ifnXNPcTPfSnJ8FMemCeOebcsmtcytyQiVjfA6EI7o0rZHZhTX8ofcOVHkbDtDY4AuvXKDCrX-S3ovxrDDRtytMh76GjCMii-PivZ4vKLxMe5EoFL2Xt8RtqYmbT3Q_NNpbkXnz0u68oqUu65VYEECTPMjIcy1_NuPjqjE",
    imageAlt:
      "Childcare provider with children at a Sutton Fields home in Celina",
    rating: 4.9,
    category: "Babysitting",
    residentOwned: true,
  },
];
