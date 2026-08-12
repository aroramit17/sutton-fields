import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Editorial-redesign IA: old routes permanently forward to their new homes
  // so bookmarks, search results, and Facebook links keep working.
  async redirects() {
    return [
      { source: "/buy-sell-trade", destination: "/classifieds", permanent: true },
      { source: "/buy-sell-trade/new", destination: "/classifieds/new", permanent: true },
      { source: "/lost-found", destination: "/classifieds?tab=lost-found", permanent: true },
      { source: "/lost-found/new", destination: "/classifieds/lost-found/new", permanent: true },
      { source: "/vendors", destination: "/directory", permanent: true },
      { source: "/carpool", destination: "/directory", permanent: true },
      { source: "/carpool/new", destination: "/directory", permanent: true },
      { source: "/newcomer-guide", destination: "/new-here", permanent: true },
      { source: "/live-here", destination: "/new-here", permanent: true },
      { source: "/community", destination: "/new-here", permanent: true },
      { source: "/connect", destination: "/directory", permanent: true },
      { source: "/get-help", destination: "/answers", permanent: true },
      { source: "/stay-informed", destination: "/news", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
