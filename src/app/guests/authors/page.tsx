import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";
import { listPublicInvitedAuthors } from "@/lib/persistence/invited-authors";

export const metadata:Metadata=createPageMetadata({
 title:"Invited Author Guest Program | Midwest Pixel Fest 2027",
 description:"Discover the Invited Author Guest Program at Midwest Pixel Fest 2027, featuring readings, writing workshops, creator panels and author conversations. Separate from paid Artist Alley spaces.",
 path:"/guests/authors",
});
export const dynamic="force-dynamic";

const ways=[
 {num:"01",title:"Panels & conversations",description:"Join fellow writers, creators and fans to talk about storytelling, publishing, genre fiction, worldbuilding or the creative journey."},
 {num:"02",title:"Workshops & learning",description:"Share practical skills in writing, editing, indie publishing, book promotion or turning a concept into a finished project."},
 {num:"03",title:"Readings & Q&A",description:"Introduce audiences to original stories, discuss characters and inspirations, and answer questions from interested readers."},
 {num:"04",title:"Book signings & connections",description:"Meet readers, sign books and connect with the local creative community when a signing arrangement is agreed."},
];
const principles=[
 {question:"Is this a regular Artist Alley booth application?",answer:"No. This is an invitation-based programming track for participating authors. Being considered for the program does not require purchasing a standard Artist Alley booth. Authors primarily seeking paid sales space can use our separate vendor application process."},
 {question:"Does an invitation guarantee a complimentary booth?",answer:"No. Guest table access, book sales, badges, travel expenses, honoraria and any other financial terms must be discussed and confirmed in writing for each author. An invited author may participate in programming without selling books."},
 {question:"Who can be considered?",answer:"Novelists, indie authors, comic writers, graphic storytellers, nonfiction writers, children's authors and other storytellers whose work or expertise adds value to convention programming. We welcome both established and emerging voices."},
 {question:"How do invited authors get selected?",answer:"Our programming team reviews fit, audience interests, relevant experience, scheduling needs and the value an author can bring through talks, readings, workshops or other activities. Invitations are handled individually and are not automatic."},
 {question:"Can an author sell or sign books?",answer:"Potentially. An author guest may be offered an agreed signing or table arrangement when space and event operations permit. A standard Artist Alley booth and a guest signing table are different arrangements; neither is automatically included."},
 {question:"Are any authors confirmed yet?",answer:"Official author guest names and programming will be announced here and on the Special Guests page only after the author and event agree on terms and approve the announcement."},
];
export default async function InvitedAuthorsPage(){
 const authors=await listPublicInvitedAuthors();
 return <InnerPage
  path="/guests/authors"
  eyebrow="Literature / Community programming"
  title="Invited Author Guest Program"
  intro="Stories belong at a gaming and pop-culture convention. We're building space for authors who bring imagination, conversation and practical creative knowledge to Midwest Pixel Fest."
  crumbs={[{name:"Home",path:"/"},{name:"Guests",path:"/guests"},{name:"Invited Authors",path:"/guests/authors"}]}
 >
  <section className="mb-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
   <div className="border-l-4 border-gold bg-panel p-6 sm:p-8">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">More than a vendor table</p>
    <h2 className="mt-4 font-display text-3xl uppercase leading-tight tracking-wide text-paper sm:text-4xl">
      Bring the stories. Share the experience.
    </h2>
    <p className="mt-5 leading-relaxed text-muted">
      Our Invited Author Guest Program is designed for authors who want to
      contribute to convention programming—not simply purchase retail space.
      Rather than asking every writer to earn back a standard vendor fee through
      book sales, we can explore guest participation through panels, readings,
      workshops, signings and conversations with fans.
    </p>
    <p className="mt-4 leading-relaxed text-muted">
      Participation is by invitation and individual agreement. Authors are not
      required to rent an Artist Alley booth solely to be considered for this
      guest track. A book table, merchandise sales, travel, compensation,
      credentials and other arrangements are negotiated separately; none are
      guaranteed by an inquiry or invitation.
    </p>
   </div>
   <div className="border border-cyan/30 bg-[#10172a] p-6 sm:p-8">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Our goal</p>
    <h2 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper">
      Put creativity in the spotlight.
    </h2>
    <p className="mt-4 leading-relaxed text-muted">
      Every great game, comic, novel and fictional universe starts with a story.
      We're making room for the storytellers behind them—whether they're
      established authors or newer voices with something valuable to share.
    </p>
    <div className="mt-6 border-t border-line pt-5">
      <p className="font-pixel text-[10px] uppercase tracking-widest text-cyan">Planned event</p>
      <p className="mt-2 font-display text-xl uppercase tracking-wide text-paper">
        October 16–17, 2027 · Emporia, Kansas
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        The selected Webb Hall venue reservation and specific programming
        space remain subject to final agreement and scheduling.
      </p>
    </div>
   </div>
  </section>

  <section className="mb-12" id="programming">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">How authors can participate</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Bring the community together.</h2>
   <div className="mt-6 grid gap-4 sm:grid-cols-2">
    {ways.map(item=><article key={item.num} className="border border-line border-t-4 border-t-cyan/50 bg-panel p-6">
      <p className="font-pixel text-xs uppercase text-magenta">{item.num} / AUTHOR EXPERIENCE</p>
      <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper">{item.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
    </article>)}
   </div>
  </section>

  <section id="confirmed-authors" className="mb-12 scroll-mt-28">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Official invited author lineup</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
    Meet the storytellers.
   </h2>
   {authors.length? <div className="mt-7 grid gap-5 md:grid-cols-2">
    {authors.map(author=><article key={author.id} className="flex flex-col border border-cyan/25 bg-panel">
     <div className="grid grid-cols-[110px_1fr] gap-5 p-5 sm:grid-cols-[145px_1fr] sm:p-7">
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden border border-line bg-ink-2">
       {author.image_url?(
        // Approved promotional photo provided by confirmed author.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={author.image_url} alt={author.public_name+" promotional portrait"} className="h-full w-full object-cover" loading="lazy"/>
       ):<span aria-hidden="true" className="font-display text-6xl text-cyan">{author.public_name.slice(0,1)}</span>}
      </div>
      <div className="min-w-0">
       <p className="font-pixel text-[10px] uppercase tracking-widest text-cyan">Invited Author Guest</p>
       <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">{author.public_name}</h3>
       {author.public_books&&<p className="mt-2 text-sm text-gold">{author.public_books}</p>}
       <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-muted">{author.public_bio}</p>
      </div>
     </div>
     <div className="flex-1 border-t border-line p-5 sm:p-7">
      {author.public_activities&&<p className="text-sm leading-relaxed text-muted"><strong className="text-paper">Planned activities:</strong> {author.public_activities}</p>}
      {author.public_signing_notes&&<p className="mt-3 text-sm leading-relaxed text-muted"><strong className="text-paper">Signing:</strong> {author.public_signing_notes}</p>}
      <div className="mt-5 flex flex-wrap gap-4">
       <Link href={"/guests/"+author.guest_slug} className="font-display text-sm uppercase text-cyan underline underline-offset-4">Guest profile →</Link>
       {author.website_url&&<a href={author.website_url} target="_blank" rel="noopener noreferrer" className="font-display text-sm uppercase text-cyan underline underline-offset-4">Author website ↗</a>}
      </div>
     </div>
    </article>)}
   </div>:<div className="mt-7 border border-cyan/30 bg-[#10172a] px-6 py-12 text-center sm:p-12">
     <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">The first chapter is being written</p>
     <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Author announcements coming soon.</h3>
     <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
      We're starting conversations with talented authors. No invited author
      appearances have been publicly confirmed yet. Only agreed, approved
      participants will be listed here.
     </p>
    </div>}
  </section>

  <section id="questions" className="mb-12 scroll-mt-24">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Frequently asked questions</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Authors, guests & Artist Alley</h2>
   <div className="mt-6 divide-y divide-line border-y border-line">
    {principles.map(item=><details key={item.question} className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase tracking-wide text-paper [&::-webkit-details-marker]:hidden">
        {item.question}<span aria-hidden="true" className="shrink-0 text-2xl text-cyan transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 max-w-4xl leading-relaxed text-muted">{item.answer}</p>
    </details>)}
   </div>
  </section>

  <section className="border border-magenta/25 bg-panel p-6 sm:p-8">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Interested in sharing your work?</h2>
   <p className="mt-3 max-w-3xl leading-relaxed text-muted">
    Our invited author placements are curated individually. If you are an
    author with ideas for a panel, reading or workshop, you're welcome to
    introduce yourself through our guest inquiry page. This is not an
    open application or a confirmed invitation.
   </p>
   <div className="mt-6 flex flex-wrap gap-3">
    <Link href="/guests/inquiry" className="inline-flex min-h-11 items-center bg-magenta px-5 py-3 font-display text-sm uppercase tracking-wider text-ink hover:bg-gold">
      Introduce yourself
    </Link>
    <Link href="/panels/submit" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
      Propose a panel
    </Link>
    <Link href="/vendors" className="inline-flex min-h-11 items-center border border-paper/30 px-5 py-3 font-display text-sm uppercase tracking-wider text-paper">
      Paid Artist Alley information
    </Link>
   </div>
  </section>
 </InnerPage>;
}
