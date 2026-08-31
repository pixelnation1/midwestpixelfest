import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { EventCta } from "@/components/cta/EventCta";
import { InnerPage } from "@/components/pages/InnerPage";
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
    note: "Dates, tickets, and weekend basics. Check FAQ first if the question is already answered there.",
  },
  {
    title: "Vendors & Artists",
    href: "/vendors/interest",
    note: "Booth and artist alley interest. Official applications are not open.",
  },
  {
    title: "Sponsors",
    href: "/sponsors/inquiry",
    note: "Partnership conversations. An inquiry is not a signed sponsorship.",
  },
  {
    title: "Press & Media",
    href: "/press/inquiry",
    note: "Coverage questions. Official media credentials are not open yet.",
  },
  {
    title: "Guests / Talent",
    href: "/guests/inquiry",
    note: "Creator and talent introductions. Submission is not a booking.",
  },
  {
    title: "Volunteers",
    href: "/volunteer/interest",
    note: "Crew interest. This is not a shift assignment.",
  },
];

export default function ContactPage() {
  return (
    <InnerPage
      path="/contact"
      breadcrumbLabel="Contact"
      eyebrow="Inbox"
      title="Contact Midwest Pixel Fest"
      intro={`Questions about the ${site.year} convention in ${site.location} can start here. Use the form for a general message, or jump to the dedicated interest form if you already know your lane.`}
    >
      <ContentSection title="Inquiry categories">
        <p>
          Pick the closest match. Dedicated forms keep vendor, sponsor, press,
          guest, and volunteer notes out of the general pile.
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
              <EventCta href={item.href} label={item.title} variant="secondary" />
            </div>
          </li>
        ))}
      </ul>

      <ContentSection title="Send a message">
        <p>
          For general questions, use the form below. If a public business inbox
          is listed, you can also email it — we do not publish personal
          addresses on this site.
        </p>
        {site.contactEmail ? (
          <p>
            Business inbox:{" "}
            <a href={`mailto:${site.contactEmail}`} className="text-cyan">
              {site.contactEmail}
            </a>
          </p>
        ) : (
          <p>
            A public inbox address is not posted yet. The form is the official
            contact path on this website.
          </p>
        )}
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
