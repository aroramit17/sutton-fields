import { PageHeader } from "@/components/layout/PageHeader";

const sections = [
  {
    title: "What we collect",
    body: "When you create an account, we collect your name, email address, and home address. Your address is used only to verify you're a Sutton Fields resident before an admin approves your account. If you post to Buy/Sell/Trade or Lost & Found, any photos you upload are stored alongside that post.",
  },
  {
    title: "How your information is used",
    body: "Your name and post content are shown to other signed-in, approved residents so neighbors know who they're talking to. We don't use your information for advertising, and we don't sell or share it with third parties.",
  },
  {
    title: "Where it's stored",
    body: "Accounts and sign-in are handled by Clerk. Profile and post data live in a Postgres database hosted on Neon. Uploaded photos are stored on Vercel Blob. All three run on Vercel's infrastructure alongside this site.",
  },
  {
    title: "Admin access",
    body: "Site admins can approve or reject new resident accounts and can remove posts that violate community guidelines. Admins do not have access to your account password, sign-in is handled entirely by Clerk.",
  },
  {
    title: "How long we keep it",
    body: "Buy/Sell/Trade listings expire automatically after 48 hours, Lost & Found posts after 14 days, and Carpool posts after 30 days. Expired posts are deactivated and no longer shown to other residents. Your account and profile remain until you ask us to delete them.",
  },
  {
    title: "Cookies",
    body: "Clerk sets a session cookie so you stay signed in between visits. We don't use third-party advertising or tracking cookies.",
  },
  {
    title: "Questions or requests",
    body: "To ask a question about your data or request that your account be deleted, contact the HOA management office through the Contact Committee link in the site footer.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <PageHeader
        label="Legal"
        title="Privacy Policy"
        description="What we collect from residents of Sutton Fields, and how it's used."
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-surface-container-low rounded-3xl p-6"
          >
            <h3 className="text-lg font-headline italic text-on-surface mb-2">
              {section.title}
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
