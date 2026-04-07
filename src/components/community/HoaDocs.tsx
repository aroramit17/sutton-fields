import { hoaDocuments } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function HoaDocs() {
  return (
    <section className="max-w-7xl mx-auto px-8 my-24">
      <SectionLabel>Official Documents</SectionLabel>
      <h2 className="text-4xl md:text-5xl font-headline mb-12">
        HOA Documents
      </h2>
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-elevated">
        <div className="space-y-0">
          {hoaDocuments.map((doc, i) => (
            <a
              key={doc.title}
              href={doc.href}
              className={`flex items-center gap-6 p-5 rounded-xl hover:bg-surface-container-low transition-colors group ${
                i < hoaDocuments.length - 1
                  ? "mb-1"
                  : ""
              }`}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Icon name={doc.icon} className="text-xl" />
              </div>
              <div className="flex-grow">
                <h4 className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">
                  {doc.title}
                </h4>
                <span className="text-xs text-on-surface-variant">
                  {doc.category} &bull; {doc.date}
                </span>
              </div>
              <Icon
                name="download"
                className="text-on-surface-variant group-hover:text-primary transition-colors"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
