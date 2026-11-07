export const AUTHOR_INVITATION_STATUSES=[
 "prospect","contacted","interested","terms_discussion",
 "confirmed","declined","withdrawn",
] as const;
export type AuthorInvitationStatus=(typeof AUTHOR_INVITATION_STATUSES)[number];
export const AUTHOR_INVITATION_LABELS:Record<AuthorInvitationStatus,string>={
 prospect:"Candidate",contacted:"Outreach started",interested:"Interested",
 terms_discussion:"Discussing arrangements",confirmed:"Participation agreed",
 declined:"Declined",withdrawn:"Withdrawn",
};
export type PublicInvitedAuthor={
 id:string;
 public_name:string;
 public_bio:string;
 public_activities:string;
 public_books:string;
 public_signing_notes:string;
 image_url:string|null;
 website_url:string|null;
 guest_slug:string;
};
export function validAuthorEmail(email:string|null){
 return !email || (email.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}
export function validAuthorStatus(value:string):value is AuthorInvitationStatus{
 return AUTHOR_INVITATION_STATUSES.includes(value as AuthorInvitationStatus);
}
export function canPublishInvitedAuthor(input:{
 authorConfirmed:boolean;guestContracted:boolean;guestPublished:boolean;
 approval:boolean;hasName:boolean;hasBio:boolean;
}):boolean{
 return input.authorConfirmed && input.guestContracted && input.guestPublished &&
  input.approval && input.hasName && input.hasBio;
}
