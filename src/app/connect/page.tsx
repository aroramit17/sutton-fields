import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { otherChannels } from "@/data/groups";

export default function ConnectPage() {
  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto">
      <PageHeader
        label="Connect"
        title="Stay Connected"
        description="Other ways to stay in the loop with your Sutton Fields neighbors."
      />

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
