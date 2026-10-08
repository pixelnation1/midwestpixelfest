import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { Button } from "@/components/ui/Button";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Midwest Pixel Fest",
  description:
    "Contact Midwest Pixel Fest for general questions, vendors, sponsors, press, guests, and volunteers. The inaugural convention is planned for 2027 in Emporia, Kansas.",
  path: "/contact",
});

const categories = [
  {
    title: "General Questions",
    href: "/faq",
    note: "Find quick answers about dates, tickets, and planning your weekend in our FAQ.",
  },
  {
    title: "Vendors & Artists",
    href: "/vendors/interest",
    note: "Tell us about your business or artwork and get notified when applications open.",
  },
  {
    title: "Sponsors",
    href: "/sponsors/inquiry",
    note: "Explore ways your business can support the fest and connect with our community.",
  },
  {
    title: "Press & Media",
    href: "/press/inquiry",
    note: "Get in touch about event coverage. Media credential details will be announced.",
  },
  {
    title: "Guests / Talent",
    href: "/guests/inquiry",
    note: "Introduce yourself and share what you would bring to Midwest Pixel Fest.",
  },
  {
    title: "Volunteers",
    href: "/volunteer/interest",
    note: "Interested in helping run the show? Tell us about your skills and availability.",
  },
];

export default function ContactPage() {
  return (
    <InnerPage
      path="/contact"
      breadcrumbLabel="Contact"
      eyebrow="Inbox"
      title="Contact Midwest Pixel Fest"
      intro={`Have a question about Midwest Pixel Fest ${site.year} in ${site.location}? Send us a message below, or choose how you would like to get involved.`}
    >
      <ContentSection title="Inquiry categories">
        <p>
          Choose the topic that fits your question so we can get your message
          to the right place.
        </p>
      </ContentSection>

      <ul className="grid gap-4 sm:grid-cols-2">
        {categories.map((item) => (
          <li key={item.title} className="flex h-full flex-col border border-line bg-panel p-6">
            <h2 className="font-display text-2xl uppercase tracking-wide">
              {item.title}
            </h2>
            <p className="mt-3 flex-1 text-muted">{item.note}</p>
            <div className="mt-6">
              <Button href={item.href} variant="secondary">
                {item.title}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <ContentSection title="Send a message">
        <p>
          For general questions, use the form below or email our team directly.
        </p>
        <p>
          Business inbox:{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-cyan">
            {site.contactEmail}
          </a>
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <ContactForm />
      </div>

      <RelatedLinks
        links={[
          { href: "/faq", label: "FAQ" },
          { href: "/tickets", label: "Tickets" },
          { href: "/press", label: "Press" },
          { href: "/privacy", label: "Privacy" },
        ]}
      />
    </InnerPage>
  );
}
