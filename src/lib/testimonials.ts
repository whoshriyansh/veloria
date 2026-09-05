export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  context: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "aditya",
    quote:
      "We walked into a term-sheet conversation thinking the product would carry us. Veloria laid out the six questions a serious fund would ask before they asked about ARR. We spent six weeks on structure. The raise took a different tone after that.",
    name: "Aditya Rao",
    role: "Founder",
    context: "B2B SaaS · Bengaluru",
  },
  {
    id: "meera",
    quote:
      "The first diligence request from the buyer was for records we did not have in one place. The Veloria Score made that visible before the data room opened. We did not lose the deal to sloppiness.",
    name: "Meera Kulkarni",
    role: "Promoter",
    context: "Manufacturing · Pune",
  },
  {
    id: "kabir",
    quote:
      "Most founders send a deck. The ones who come through a readiness review send a company that can survive a second meeting. That is the difference we underwrite.",
    name: "Kabir Singhania",
    role: "Managing Partner",
    context: "Family office · Delhi",
  },
  {
    id: "rhea",
    quote:
      "Project contracts and counterparty risk were treated as paperwork until they were not. The review changed how we signed the next three work orders — and who we allowed to sit across the table.",
    name: "Rhea Nair",
    role: "Founder",
    context: "Real-estate development · Bombay",
  },
  {
    id: "vikram",
    quote:
      "Payment terms, subcontracting and liability sat in WhatsApp threads. Veloria put them into a structure a lender could read. Our working-capital conversation became shorter, and quieter.",
    name: "Vikram Desai",
    role: "CEO",
    context: "Contractor group · Ahmedabad",
  },
  {
    id: "ananya",
    quote:
      "I thought legal health was a post-raise problem. The checkup was uncomfortable and specific. That is why I trusted it — and why we fixed the cap table before we hired the banker.",
    name: "Ananya Iyer",
    role: "Operator",
    context: "Marketplace · Hyderabad",
  },
];
