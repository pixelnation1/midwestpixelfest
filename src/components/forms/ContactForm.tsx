"use client";

import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";

export function ContactForm() {
  return (
    <InquiryForm
      kind="contact"
      submitLabel="Send Message"
      successTitle="Your interest has been received"
    >
      <TextInput
        id="contact-name"
        name="name"
        label="Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="contact-email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
      />
      <Select
        id="contact-inquiry-type"
        name="inquiryType"
        label="Subject / Inquiry Type"
        required
        options={formOptionLists.contactTypes}
      />
      <TextArea
        id="contact-message"
        name="message"
        label="Message"
        required
        maxLength={FIELD_LIMITS.message}
      />
      <ConsentCheckbox />
    </InquiryForm>
  );
}
