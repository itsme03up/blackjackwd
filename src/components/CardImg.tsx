// src/components/CardImg.tsx
type Props = { code: string; back?: boolean }; // 例: "AS" (Ace of Spades)

export default function CardImg({ code, back }: Props) {
  const src = back ? '/image/card.png' : `/cards/${code}.svg`; // public/cards に置いた前提
  return (
    <img
      src={src}
      alt={back ? 'card back' : code}
      className="w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 object-contain"
      draggable={false}
    />
  );
}
