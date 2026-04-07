import { schools } from "@/data/community";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SchoolInfo() {
  const primarySchool = schools[0];
  const otherSchools = schools.slice(1);

  return (
    <section className="max-w-7xl mx-auto px-8 mb-24">
      <SectionLabel>Schools &amp; Education</SectionLabel>
      <h2 className="text-4xl md:text-5xl font-headline mb-12">
        Local Schools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Featured School */}
        <div className="md:col-span-7">
          <div className="bg-surface-container-low p-8 rounded-[2rem]">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Icon name="school" />
              </div>
              <div>
                <h3 className="text-2xl font-headline italic">
                  {primarySchool.name}
                </h3>
                <span className="text-sm text-on-surface-variant">
                  {primarySchool.type} &bull; Grades {primarySchool.gradeRange}
                  {primarySchool.distance && ` &bull; ${primarySchool.distance}`}
                </span>
              </div>
            </div>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              {primarySchool.description}
            </p>
            <a
              href={primarySchool.href}
              className="inline-flex items-center text-primary font-bold text-sm gap-2"
            >
              Visit Website <Icon name="open_in_new" className="text-sm" />
            </a>
          </div>
        </div>

        {/* Other Schools */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {otherSchools.map((school) => (
            <div
              key={school.name}
              className="bg-surface-container-lowest p-6 rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon name="school" className="text-primary text-lg" />
                <h4 className="font-headline text-lg italic group-hover:text-primary transition-colors">
                  {school.name}
                </h4>
              </div>
              <p className="text-sm text-on-surface-variant mb-1">
                {school.type} &bull; Grades {school.gradeRange}
              </p>
              <p className="text-sm text-on-surface-variant">
                {school.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
