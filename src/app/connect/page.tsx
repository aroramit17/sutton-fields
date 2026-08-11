import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { communityGroups, otherChannels } from "@/data/groups";

export default function ConnectPage() {
  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <PageHeader
        label="Connect"
        title="Find Your Group"
        description="WhatsApp sub-groups by school and interest, plus other ways to stay in the loop. If you don't see a group you're looking for, ask in the main group."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {communityGroups.map((group) => (
          <a
            key={group.name}
            href={group.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container-lowest hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon name="chat" className="text-primary" />
              <h3 className="font-headline italic text-lg text-on-surface">
                {group.name}
              </h3>
            </div>
            <p className="text-on-surface-variant text-sm">{group.description}</p>
          </a>
        ))}
      </div>

      <h2 className="text-2xl font-headline italic mb-6">Other Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {otherChannels.map((channel) => (
          <a
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-container-low rounded-3xl p-6 hover:bg-surface-container-lowest hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon name="public" className="text-primary" />
              <h3 className="font-headline italic text-lg text-on-surface">
                {channel.name}
              </h3>
            </div>
            <p className="text-on-surface-variant text-sm">{channel.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
