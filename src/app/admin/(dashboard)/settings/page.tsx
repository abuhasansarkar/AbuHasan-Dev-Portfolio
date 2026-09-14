import { PageHeader } from "@/components/admin/page-header";
import { SettingsSectionForm } from "@/components/admin/settings-section-form";
import { settingsSections } from "@/lib/admin/settings-fields";
import { loadSettingsUncached } from "@/lib/settings/get-settings";

export default async function SettingsPage() {
  const settings = await loadSettingsUncached();

  return (
    <>
      <PageHeader title="Site settings" description="Copy, links, stats and SEO defaults. Each section saves independently." />
      <nav aria-label="Settings sections" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
        {settingsSections.map((s) => (
          <a key={s.key} href={`#settings-${s.key}`} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/40 hover:text-foreground">
            {s.title}
          </a>
        ))}
      </nav>
      <div className="flex flex-col gap-6">
        {settingsSections.map((section) => (
          <SettingsSectionForm key={section.key} section={section} values={settings[section.key]} />
        ))}
      </div>
    </>
  );
}
