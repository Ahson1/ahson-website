import type { MetadataRoute } from "next";
import { RECOGNITION, SITE_URL } from "@/app/lib/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}${RECOGNITION.photo.src}`],
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
