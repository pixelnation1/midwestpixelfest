import type { Metadata } from "next";
import Link from "next/link";
import { PanelProposalForm } from "@/components/panels/PanelProposalForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";
export const metadata:Metadata=createPageMetadata({
 title:"Panel Submission | Midwest Pixel Fest 2027",
 description:"Apply to host a fan-led panel, cosplay workshop, gaming talk or tabletop discussion at Midwest Pixel Fest October 16–17, 2027.",
 path:"/panels/submit",
});
export default function PanelSubmitPage(){return <InnerPage path="/panels/submit" eyebrow="2027 / Programming application" title="Propose a panel" intro="Share an idea for a discussion, presentation, workshop or fan meetup. New presenters are welcome. All proposals are reviewed before any program slot is offered." crumbs={[{name:"Home",path:"/"},{name:"Panels",path:"/panels"},{name:"Submit a Proposal",path:"/panels/submit"}]}>
 <div className="mb-8 border-l-4 border-gold bg-panel px-6 py-5">
   <p className="font-display text-xl uppercase text-gold">Before you apply</p>
   <p className="mt-2 text-muted">Midwest Pixel Fest is planned for October 16–17, 2027, in Emporia. Webb Hall at ESU is our selected venue but the reservation is pending. A submission is not a scheduled appearance, contract, compensation offer or complimentary badge. Panel duration, space and equipment are subject to organizer confirmation.</p>
 </div>
 <div className="border border-line bg-panel p-5 sm:p-8"><PanelProposalForm /></div>
 <p className="mt-6 text-sm text-muted">Need something else? <Link href="/guests/inquiry" className="text-cyan underline">Featured guest inquiries</Link> are separate from community panel proposals. <Link href="/contact" className="text-cyan underline">Contact our team</Link> for general questions.</p>
 </InnerPage>}