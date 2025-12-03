import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // disallow: "/admin", // si en el futuro querés bloquear algo
    },
    sitemap: "https://fooddeliveryday.com.ar/sitemap.xml", // cambiá si usás otro dominio
  };
}
