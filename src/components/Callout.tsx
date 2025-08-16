// src/components/Callout.tsx
export function Callout({ title="レビュー", children }: React.PropsWithChildren<{title?: string}>) {
  return (
    <div className="mt-3 rounded-lg border border-amber-300/30 bg-amber-950/20 p-3">
      <p className="text-amber-300 font-semibold mb-1">{title}</p>
      <div className="text-amber-100/90 leading-relaxed text-sm">{children}</div>
    </div>
  );
}
