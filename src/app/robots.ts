import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/create/", "/demo/"],
    },
    sitemap: ["https://poems.amonxu.com/sitemap.xml"],
  };
}
