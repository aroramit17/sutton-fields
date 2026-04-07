import { hoaDocuments } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContentGate } from "@/components/ui/ContentGate";

export function HoaDocs() {
  // Show document titles publicly (good for SEO - people search for these)
  // but gate the actual download/view links behind login
  return (
    <section className="max-w-7xl mx-auto px-8 my-24">
      <SectionLabel>Official Documents</SectionLabel>
      <h2 className="text-4xl md:text-5xl font-headline mb-4">
        HOA Documents
      </h2>
      <p className="text-on-surface-variant mb-12 max-w-2xl">
        The Sutton Fields HOA maintains governing documents, architectural guidelines,
        and financial reports. Residents can access and download all documents after logging in.
      </p>

      {/* Public preview of document list (SEO-indexable) */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-elevated mb-8">
        <div className="space-y-0">
          {hoaDocuments.map((doc, i) => (
            <div
              key={doc.title}
              className={`flex items-center gap-6 p-5 rounded-xl ${
                i < hoaDocuments.length - 1 ? "mb-1" : ""
              }`}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                <Icon name={doc.icon} className="text-xl" />
              </div>
              <div className="flex-grow">
                <h4 className="font-headline text-lg text-on-surface">
                  {doc.title}
                </h4>
                <span className="text-xs text-on-surface-variant">
                  {doc.category} &bull; {doc.date}
                </span>
              </div>
              <Icon
                name="lock"
                className="text-on-surface-variant/40"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gate for download access */}
      <ContentGate
        title="Resident Access Required"
        description="Log in with your Sutton Fields resident account to view and download HOA documents, meeting minutes, and financial reports."
      />
    </section>
  );
}
