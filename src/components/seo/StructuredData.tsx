export function CommunityStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ResidentialDevelopment",
    name: "Sutton Fields",
    description:
      "Sutton Fields is a master-planned community of 2,289 homes in Celina, Texas, developed by Centurion American. Features resort-style pools, walking trails, community garden, and top-rated Prosper ISD schools including Dan Christie Elementary within the community.",
    url: "https://suttonfields.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4600 Waugh Avenue",
      addressLocality: "Celina",
      addressRegion: "TX",
      postalCode: "75009",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.3148,
      longitude: -96.7846,
    },
    numberOfAvailableAccommodation: {
      "@type": "QuantitativeValue",
      value: 2289,
      unitText: "homes",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Resort-Style Swimming Pools", value: true },
      { "@type": "LocationFeatureSpecification", name: "Splash Pad", value: true },
      { "@type": "LocationFeatureSpecification", name: "Walking Trails (3+ miles)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Community Garden & Pocket Farms", value: true },
      { "@type": "LocationFeatureSpecification", name: "Amenity Center with Fire Pit", value: true },
      { "@type": "LocationFeatureSpecification", name: "Basketball Court", value: true },
      { "@type": "LocationFeatureSpecification", name: "Playgrounds", value: true },
    ],
    containedInPlace: {
      "@type": "City",
      name: "Celina",
      containedInPlace: {
        "@type": "State",
        name: "Texas",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function HOAStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sutton Fields Homeowners Association",
    url: "https://suttonfields.com",
    telephone: "972-428-2030",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4570 Westgrove Drive, Suite 230",
      addressLocality: "Addison",
      addressRegion: "TX",
      postalCode: "75001",
      addressCountry: "US",
    },
    member: {
      "@type": "Organization",
      name: "Essex Association Management L.P.",
      telephone: "972-428-2030",
    },
    areaServed: {
      "@type": "Place",
      name: "Sutton Fields, Celina, TX 75009",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://suttonfields.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQStructuredData({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
