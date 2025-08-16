// src/components/CardImg.tsx
type Props = { code: string; back?: boolean };

export default function CardImg({ code, back }: Props) {
  const src = back ? '/image/card.png' : `/cards/${code}.svg`;
  return (
    <div className="w-16 h-24 shrink-0 rounded-md border border-zinc-700 bg-zinc-900 grid place-items-center">
      <img
        src={src}
        alt={back ? 'card back' : code}
        className="!w-full !h-full object-contain rounded-md"
        draggable={false}
      />
    </div>
  );
}
