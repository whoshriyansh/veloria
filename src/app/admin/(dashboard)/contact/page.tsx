import { getContactInfo } from "@/lib/cms";
import { ContactForm } from "@/components/admin/contact-form";

export default async function ContactPage() {
  const contact = await getContactInfo();
  return (
    <ContactForm
      initial={{
        email: contact.email,
        phone: contact.phone,
        address: contact.address,
        linkedin: contact.linkedin,
        twitter: contact.twitter,
        calendly: contact.calendly,
        hours: contact.hours,
      }}
    />
  );
}
