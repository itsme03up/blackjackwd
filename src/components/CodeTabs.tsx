// src/components/CodeTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyButton } from "@/components/CopyButton";

type Snippet = { label: string; lang: "c"|"ts"|"js"; code: string };

export function CodeTabs({ items }: { items: Snippet[] }) {
  return (
    <Tabs defaultValue={items[0]?.label} className="w-full">
      <TabsList className="bg-zinc-900/60 backdrop-blur mb-2">
        {items.map(s => (
          <TabsTrigger key={s.label} value={s.label} className="data-[state=active]:text-emerald-300">
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map(s => (
        <TabsContent key={s.label} value={s.label}>
          <div className="relative group">
            <pre className="rounded-lg bg-zinc-900/70 border border-zinc-800 p-3 overflow-x-auto text-sm">
              <code className={`language-${s.lang}`}>{s.code}</code>
            </pre>
            <CopyButton text={s.code} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

