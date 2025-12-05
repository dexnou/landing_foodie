import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // disallow: "/admin", // si en el futuro querés bloquear algo
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`, // cambiá si usás otro dominio
  };
}
