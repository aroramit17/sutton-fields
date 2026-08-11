import { schools } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SchoolInfo() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-24">
      <SectionLabel>Schools &amp; Education</SectionLabel>
      <h2 className="text-4xl md:text-5xl font-headline mb-12">
        Local Schools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {schools.map((school) => (
          <div
            key={school.name}
            className="bg-surface-container-low p-8 rounded-[2rem] flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Icon name="school" />
              </div>
              <div>
                <h3 className="text-2xl font-headline italic">
                  {school.name}
                </h3>
                <span className="text-sm text-on-surface-variant">
                  {school.type} • Grades {school.gradeRange}
                  {school.distance && ` • ${school.distance}`}
                </span>
              </div>
            </div>
            <p className="text-on-surface-variant leading-relaxed mb-6 flex-grow">
              {school.description}
            </p>
            <a
              href={school.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary font-bold text-sm gap-2"
            >
              Visit Website <Icon name="open_in_new" className="text-sm" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
