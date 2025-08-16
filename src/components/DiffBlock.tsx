// src/components/DiffBlock.tsx
export function DiffBlock({ diff }: { diff: string }) {
  return (
    <pre className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-3 overflow-x-auto text-sm leading-relaxed">
      {diff.split("\n").map((l, i) => (
        <div key={i} className={
          l.startsWith("+") ? "text-emerald-300" :
          l.startsWith("-") ? "text-rose-300" : "text-zinc-100"
        }>{l}</div>
      ))}
    </pre>
  );
}
