import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.name,
    description: BRAND.description,
    start_url: "/",
    display: "browser",
    background_color: "#f3efe7",
    theme_color: "#0b1f1a",
    lang: "en-IN",
    icons: [
      {
        src: "/logo/logo_trans.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo/logo_trans.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
