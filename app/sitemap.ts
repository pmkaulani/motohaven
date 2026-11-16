import { MetadataRoute } from "next";
import { VehiclesRepository } from "@/lib/repositories/vehicles";
import { getSiteUrl } from "@/lib/config/dealership";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const { vehicles } = await VehiclesRepository.getPublishedVehicles({ limit: 50 });
    const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
      url: `${baseUrl}/cars/${v.slug}`,
      lastModified: new Date(v.created_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticRoutes, ...vehicleRoutes];
  } catch {
    return staticRoutes;
  }
}
