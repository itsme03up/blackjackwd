// src/components/ReviewTOC.tsx
export function ReviewTOC({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="hidden lg:block sticky top-4 h-[calc(100dvh-2rem)]">
      <ul className="space-y-2 text-sm text-zinc-400">
        {items.map(i => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="hover:text-emerald-300">{i.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
