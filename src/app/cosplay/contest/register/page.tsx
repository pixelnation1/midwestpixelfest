import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { CosplayContestForm } from "@/components/cosplay-contest/CosplayContestForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata:Metadata=createPageMetadata({
 title:"Cosplay Contest Registration | Midwest Pixel Fest 2027",
 description:"Submit an individual, group or youth cosplay contest application for Midwest Pixel Fest 2027. Application review and final rules follow.",
 path:"/cosplay/contest/register",
});
export default function CosplayRegisterPage(){
 return <InnerPage
  path="/cosplay/contest/register"
  eyebrow="Cosplay / Contest registration"
  title="Apply for the Cosplay Contest"
  intro="Bring your imagination to Midwest Pixel Fest 2027. Share your costume concept and join the review queue for our inaugural cosplay competition and showcase."
  crumbs={[{name:"Home",path:"/"},{name:"Cosplay",path:"/cosplay"},{name:"Contest",path:"/cosplay/contest"},{name:"Register",path:"/cosplay/contest/register"}]}
 >
  <div className="mb-8 border-l-4 border-gold bg-panel p-6">
   <h2 className="font-display text-xl uppercase text-gold">A few things to know first</h2>
   <p className="mt-3 leading-relaxed text-muted">This is an application for organizer review, not a confirmed contest slot. Divisions, judging, eligibility, stage times, awards, venue requirements and admission terms will be finalized before selections are confirmed. Applications are currently being collected without payment.</p>
   <p className="mt-3 text-sm text-muted">For registrants under 18, an adult must complete the form and confirm parental/guardian permission. Avoid sharing children's private contact details or medical histories.</p>
  </div>
  <div className="border border-line bg-panel p-5 sm:p-8"><CosplayContestForm/></div>
  <p className="mt-7 text-sm text-muted">Need to review the <Link href="/cosplay/contest" className="text-cyan underline">contest information</Link>, <Link href="/weapons-policy" className="text-cyan underline">prop safety guidance</Link>, or <Link href="/attendee-services" className="text-cyan underline">accessibility resources</Link>? Those details are available before submitting.</p>
 </InnerPage>;
}
