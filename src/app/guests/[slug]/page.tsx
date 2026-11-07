import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestExperienceDetails } from "@/components/guests/GuestExperienceDetails";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { getGuestBySlug } from "@/content/guests";
import { getPublicGuestExperienceBySlug } from "@/lib/persistence/guest-experiences";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props={params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const publicGuest=await getPublicGuestExperienceBySlug(slug);
 const fallback=getGuestBySlug(slug);
 const name=publicGuest?.display_name??fallback?.name;
 const bio=publicGuest?.bio??fallback?.bio;
 if(!name||!bio)return {robots:{index:false,follow:true}};
 return createPageMetadata({
  title:name+" | Midwest Pixel Fest Guests",
  description:bio,
  path:"/guests/"+slug,
 });
}

export default async function GuestProfilePage({params}:Props){
 const {slug}=await params;
 const experience=await getPublicGuestExperienceBySlug(slug);
 const fallback=getGuestBySlug(slug);
 const guest=experience?{
  name:experience.display_name,role:experience.role_label,bio:experience.bio,
 }:fallback;
 if(!guest)notFound();

 return <InnerPage
  path={"/guests/"+slug}
  crumbs={[
   {name:"Home",path:"/"},
   {name:"Guests",path:"/guests"},
   {name:guest.name},
  ]}
  eyebrow={guest.role}
  title={guest.name}
  intro={guest.bio}
 >
  {experience?<div className="mb-10">
   <GuestExperienceDetails guest={experience}/>
  </div>:<p className="mb-10 border border-line bg-panel p-6 leading-relaxed text-muted">
   Guest activities and appearance times will be posted when confirmed.
   Autograph and photo-op options, if available, may be ticketed separately.
  </p>}
  <RelatedLinks links={[
   {href:"/guests",label:"All guests"},
   {href:"/guests/autographs",label:"Autographs & Photo Ops"},
   {href:"/schedule",label:"Schedule"},
   {href:"/tickets",label:"Tickets"},
  ]}/>
 </InnerPage>;
}
