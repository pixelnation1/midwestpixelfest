import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
};

export function createPageMetadata({
  title,
  description,
  path,
  ogType = "website",
  publishedTime,
  modifiedTime,
  robots,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const index = robots?.index ?? true;
  const follow = robots?.follow ?? index;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      locale: "en_US",
      siteName: site.name,
      title,
      description,
      url,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index,
      follow,
    },
  };
}

export const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
