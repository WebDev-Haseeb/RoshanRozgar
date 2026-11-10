import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Roshan Rozgar collects, uses and protects your personal information.",
};

const CONTACT_EMAIL = "privacy@roshanrozgar.pk";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          Roshan Rozgar is an online marketplace that connects households in Pakistan with independent skilled
          trade workers such as electricians, plumbers, AC technicians, carpenters, painters and mechanics. In this
          policy, “Roshan Rozgar”, “we”, “us” and “our” refer to the operators of the Roshan Rozgar website and
          services.
        </p>
        <p>
          This policy explains what information we collect when you use our services, why we collect it, who we
          share it with and the choices available to you. It applies to both customers and workers.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Account details</strong> such as your name, email address, mobile number, password and whether
            you are joining as a customer or a worker.
          </li>
          <li>
            <strong>Worker profile details</strong> such as your trade, skills, years of experience, service areas,
            availability, a profile photo and a short introduction.
          </li>
          <li>
            <strong>Voice recordings</strong> you choose to make, for example when setting up a profile, describing
            a job, sending a voice message or leaving a voice review.
          </li>
          <li>
            <strong>Job requests</strong> including the type of work, a description of the problem, the address or
            area, a preferred time and any photos you attach.
          </li>
          <li>
            <strong>Messages and quotations</strong> exchanged between customers and workers, including prices
            proposed and agreed.
          </li>
          <li>
            <strong>Ratings and reviews</strong> written or recorded after a completed booking.
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>
            <strong>Location</strong>, if you allow your browser to share it, so we can show workers near you or
            jobs near your service area.
          </li>
          <li>
            <strong>Usage and device information</strong> such as pages visited, actions taken, browser type, IP
            address and error logs, which help us keep the service secure and working properly.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How we use your information",
    content: (
      <>
        <p>We use the information described above to:</p>
        <ul>
          <li>create and manage your account and keep you signed in securely;</li>
          <li>build and display worker profiles to customers looking for help nearby;</li>
          <li>match job requests with suitable workers based on trade, distance and availability;</li>
          <li>let customers and workers communicate, exchange quotations and confirm bookings;</li>
          <li>keep worker availability accurate so that confirmed bookings do not overlap;</li>
          <li>show ratings and reviews that help other customers make informed decisions;</li>
          <li>respond to questions, complaints and requests for support;</li>
          <li>detect, investigate and prevent fraud, abuse and violations of our Terms of Service; and</li>
          <li>meet our legal obligations.</li>
        </ul>
        <p>We do not sell your personal information, and we do not use it to show you third-party advertising.</p>
      </>
    ),
  },
  {
    id: "voice-recordings",
    title: "Voice recordings and speech processing",
    content: (
      <>
        <p>
          Voice features are optional. When you use them, your recording is sent securely to a speech recognition
          service that converts it into text. The text may then be processed by a language service to identify
          details such as a trade, years of experience, a location or a preferred time.
        </p>
        <p>
          These details are always shown to you for review before they are saved. You can correct or remove
          anything that is wrong, and you can complete every step by typing instead.
        </p>
        <p>
          Voice messages and voice reviews are stored so that the intended recipient, or in the case of reviews,
          other customers, can listen to them. Recordings used only to fill in a form are not shown to other users.
        </p>
      </>
    ),
  },
  {
    id: "what-others-can-see",
    title: "What other users can see",
    content: (
      <>
        <ul>
          <li>
            <strong>Worker profiles</strong> are visible to customers and include your name, photo, trade, skills,
            experience, service areas, availability status, average rating, number of completed jobs and reviews.
          </li>
          <li>
            <strong>Customer details</strong> such as your name and the job description are shared with workers you
            contact or request quotes from. Your exact address is shared only with the worker once a booking is
            confirmed.
          </li>
          <li>
            <strong>Messages</strong> are visible only to the customer and worker taking part in the conversation.
          </li>
          <li>
            <strong>Reviews</strong> are shown publicly on the worker’s profile with your first name and area.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    content: (
      <>
        <p>We share personal information only in the following circumstances:</p>
        <ul>
          <li>
            <strong>With service providers</strong> who help us run Roshan Rozgar, including providers of cloud
            hosting, authentication, databases and file storage, and providers of speech recognition and language
            processing. They may use your information only to provide services to us.
          </li>
          <li>
            <strong>Between customers and workers</strong> as described above, so that a job can be discussed,
            agreed and completed.
          </li>
          <li>
            <strong>For legal reasons</strong>, when we believe in good faith that disclosure is required by
            applicable law or a lawful request from a public authority in Pakistan, or is necessary to protect the
            safety, rights or property of our users, the public or Roshan Rozgar.
          </li>
          <li>
            <strong>In a business transfer</strong>, such as a merger or acquisition, in which case this policy will
            continue to apply to your information.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "location",
    title: "Location information",
    content: (
      <>
        <p>
          We ask for your browser’s permission before using your device location. If you decline, you can still
          choose your area manually. Workers’ approximate locations are used to calculate distance; customers see
          the distance and service area rather than a worker’s precise position.
        </p>
        <p>You can withdraw location permission at any time in your browser settings.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    content: (
      <>
        <p>
          We keep your information for as long as your account is active and for as long as needed to provide the
          service. Booking records, quotations and reviews may be retained after a job is completed so that
          ratings remain accurate and disputes can be resolved.
        </p>
        <p>
          When you delete your account, we delete or anonymise your personal information within a reasonable
          period, except where we must keep certain records to comply with the law, resolve disputes or enforce
          our agreements. Reviews you have written may remain on a worker’s profile in anonymised form.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    content: (
      <>
        <p>
          We use reasonable technical and organisational measures to protect your information, including encrypted
          connections, access controls that limit who can view each record, and server-side checks on important
          actions such as confirming a booking or posting a review.
        </p>
        <p>
          No online service can be completely secure. Please keep your password private and contact us straight
          away if you believe your account has been accessed without your permission.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices and rights",
    content: (
      <>
        <p>You can:</p>
        <ul>
          <li>view and update your account and profile information at any time;</li>
          <li>change your availability or hide your worker profile by setting yourself offline;</li>
          <li>decline or withdraw permission for location and microphone access in your browser;</li>
          <li>ask us for a copy of the personal information we hold about you;</li>
          <li>ask us to correct information that is inaccurate; and</li>
          <li>ask us to delete your account and associated personal information.</li>
        </ul>
        <p>
          To make a request, contact us using the details below. We may need to verify your identity before
          acting on it.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        Roshan Rozgar is intended for people aged 18 and over. We do not knowingly collect personal information
        from anyone under 18. If you believe a child has created an account, please contact us and we will remove
        it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. When we make significant changes, we will update the date at
        the top of this page and, where appropriate, let you know through the service. Continuing to use Roshan
        Rozgar after a change takes effect means you accept the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          If you have questions about this policy or how your information is handled, email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          Please also read our <Link href="/terms">Terms of Service</Link>, which govern your use of Roshan Rozgar.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      current="privacy"
      title="Privacy Policy"
      updated="10 November 2026"
      intro={
        <p>
          Your privacy matters to us. This policy explains, in plain language, what information Roshan Rozgar
          collects, how it is used and the control you have over it.
        </p>
      }
      sections={sections}
    />
  );
}
