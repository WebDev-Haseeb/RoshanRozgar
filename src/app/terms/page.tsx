import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use Roshan Rozgar as a customer or a worker.",
};

const CONTACT_EMAIL = "support@roshanrozgar.pk";

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    content: (
      <>
        <p>
          These Terms of Service form an agreement between you and Roshan Rozgar. By creating an account or using
          our website and services, you agree to these terms and to our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not use Roshan Rozgar.
        </p>
      </>
    ),
  },
  {
    id: "our-service",
    title: "What Roshan Rozgar does",
    content: (
      <>
        <p>
          Roshan Rozgar is a marketplace. We provide tools that help customers find skilled trade workers nearby,
          communicate with them, agree on a price and confirm a booking, and that help workers present their
          skills and manage their work.
        </p>
        <p>
          Workers on Roshan Rozgar are <strong>independent service providers</strong>. They are not our employees,
          agents or contractors, and we do not perform, supervise or control the services they provide. Any
          agreement for work is made directly between the customer and the worker.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Eligibility and accounts",
    content: (
      <ul>
        <li>You must be at least 18 years old and able to enter into a binding agreement.</li>
        <li>The information you provide must be accurate, current and your own.</li>
        <li>You may hold only one account and may not create an account on behalf of someone else without their permission.</li>
        <li>You are responsible for keeping your password secure and for all activity on your account.</li>
        <li>Let us know immediately if you suspect unauthorised use of your account.</li>
      </ul>
    ),
  },
  {
    id: "customers",
    title: "If you are a customer",
    content: (
      <>
        <p>As a customer, you agree to:</p>
        <ul>
          <li>describe the job honestly and as completely as you can, including any known risks;</li>
          <li>provide a safe working environment and reasonable access to the area where work is needed;</li>
          <li>be available at the agreed time, or cancel through the service as early as possible;</li>
          <li>pay the worker the agreed amount once the work is completed as agreed; and</li>
          <li>leave reviews that are honest and based on your own experience.</li>
        </ul>
      </>
    ),
  },
  {
    id: "workers",
    title: "If you are a worker",
    content: (
      <>
        <p>As a worker, you agree to:</p>
        <ul>
          <li>represent your trade, skills and experience truthfully;</li>
          <li>hold any licence, permit or qualification required for the work you accept;</li>
          <li>keep your availability up to date and arrive at the agreed time;</li>
          <li>carry out work with reasonable care and skill, and in line with applicable safety practices;</li>
          <li>charge only the price agreed through the service, unless the customer approves a change before the extra work begins; and</li>
          <li>treat customers, their families and their property with respect.</li>
        </ul>
        <p>
          You are responsible for your own tools, materials, taxes and any insurance you choose to hold.
        </p>
      </>
    ),
  },
  {
    id: "bookings",
    title: "Requests, quotations and bookings",
    content: (
      <>
        <ul>
          <li>A customer may send a job request to one or more workers.</li>
          <li>A worker may decline a request or reply with a quotation. All prices are shown in Pakistani rupees (PKR).</li>
          <li>
            A booking is confirmed only when the customer accepts a quotation. Once confirmed, the worker is shown
            as busy and cannot accept another booking that conflicts with it.
          </li>
          <li>
            Either party may cancel a confirmed booking through the service. Repeated late cancellations or
            no-shows may lead to restrictions on your account.
          </li>
          <li>When the work is finished, the booking is marked complete and the customer may leave a review.</li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    content: (
      <p>
        Roshan Rozgar does not currently process payments. Customers pay workers directly, by cash or another
        method they both agree on. We are not a party to that payment and are not responsible for collecting,
        refunding or guaranteeing it. Any dispute about payment is between the customer and the worker, although
        we may help where we reasonably can.
      </p>
    ),
  },
  {
    id: "reviews",
    title: "Ratings and reviews",
    content: (
      <>
        <p>
          Only a customer whose booking has been marked complete may review the worker for that booking. Reviews
          must be honest, relevant to the job and free of abusive, discriminatory or private content such as
          phone numbers or addresses.
        </p>
        <p>
          We may remove reviews that break these rules, but we do not edit reviews to change their meaning. We do
          not accept payment in exchange for removing or altering reviews.
        </p>
      </>
    ),
  },
  {
    id: "voice-features",
    title: "Voice features",
    content: (
      <p>
        Voice features turn your speech into text and suggest details for profiles and job requests. Speech
        recognition can make mistakes, particularly with background noise or mixed languages. You are responsible
        for reviewing the details shown to you and correcting anything that is wrong before confirming.
      </p>
    ),
  },
  {
    id: "conduct",
    title: "Acceptable use",
    content: (
      <>
        <p>You must not:</p>
        <ul>
          <li>use Roshan Rozgar for anything unlawful, fraudulent or harmful;</li>
          <li>harass, threaten or discriminate against any other user;</li>
          <li>post false information, impersonate another person or misrepresent your skills;</li>
          <li>arrange to avoid the booking process in order to manipulate ratings or availability;</li>
          <li>upload content you do not have the right to share, or content that is offensive or explicit;</li>
          <li>attempt to access accounts or data that are not yours, or interfere with the security of the service; or</li>
          <li>copy, scrape or resell any part of the service without our written permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "safety",
    title: "Safety",
    content: (
      <>
        <p>
          Ratings, reviews and profile information can help you choose, but they are not a guarantee. Roshan
          Rozgar does not currently verify identity against government records or carry out background checks.
          Please use your own judgement, share visit details with someone you trust and contact the relevant
          emergency services if you are ever in danger.
        </p>
        <p>
          Report any unsafe behaviour to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> so we can
          take appropriate action.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <p>
        Roshan Rozgar is provided “as is” and “as available”. To the extent permitted by law, we make no promise
        that the service will be uninterrupted or error free, or that any worker, customer or job will meet your
        expectations. We are not responsible for the quality, safety or legality of work performed by workers, or
        for the conduct of any user.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <p>
        To the extent permitted by the laws of Pakistan, Roshan Rozgar will not be liable for any indirect,
        incidental or consequential loss, or for any loss or damage arising from work carried out by a worker,
        from payments made between users, or from your interactions with other users. Nothing in these terms
        limits any liability that cannot be limited under applicable law.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and closing your account",
    content: (
      <>
        <p>
          You may stop using Roshan Rozgar and close your account at any time. We may suspend or close an account,
          or remove content, if we reasonably believe these terms have been broken, if required by law, or to
          protect other users.
        </p>
        <p>
          Sections that by their nature should continue after an account is closed, including payments,
          disclaimers and limitation of liability, will continue to apply.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <p>
        These terms are governed by the laws of the Islamic Republic of Pakistan. Any dispute that cannot be
        resolved informally will be subject to the exclusive jurisdiction of the courts at Islamabad.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms as the service develops. When we make significant changes, we will update the
        date at the top of this page and, where appropriate, notify you through the service. If you continue to
        use Roshan Rozgar after the changes take effect, you accept the updated terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        Questions about these terms can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      current="terms"
      title="Terms of Service"
      updated="10 November 2026"
      intro={
        <p>
          These terms explain how Roshan Rozgar works and what we expect from everyone who uses it, whether you are
          looking for help at home or offering your skills.
        </p>
      }
      sections={sections}
    />
  );
}
