import { useEffect, useMemo, useState } from "react";

/** ===== 型 ===== */
type Suit = "♥" | "♦" | "♣" | "♠";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type Card = { suit: Suit; rank: Rank; value: number };

type Phase = "idle" | "player" | "dealer" | "result";

/** ===== デッキ生成・ユーティリティ ===== */
function createDeck(): Card[] {
  const suits: Suit[] = ["♥", "♦", "♣", "♠"];
  const ranks: Rank[] = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const values = [11,2,3,4,5,6,7,8,9,10,10,10,10];
  const deck: Card[] = [];
  for (const s of suits) {
    ranks.forEach((r, i) => deck.push({ suit: s, rank: r, value: values[i] }));
  }
  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function handValue(hand: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    total += c.value;
    if (c.rank === "A") aces++;
  }
  // A(11)を1へ下げる
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function cardLabel(c: Card) {
  return `${c.suit}${c.rank}`;
}

/** ===== 画面本体 ===== */
export default function Game() {
  const freshDeck = useMemo(() => shuffle(createDeck()), []);
  const [deck, setDeck] = useState<Card[]>(freshDeck);
  const [pos, setPos] = useState(0);

  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<string>("");

  /** 1枚引く */
  const draw = () => {
    if (pos >= deck.length) return null;
    const c = deck[pos];
    setPos(p => p + 1);
    return c;
  };

  /** 初期配布（P-D-P-D の順） */
  const deal = () => {
    const d1 = draw(), p1 = draw(), d2 = draw(), p2 = draw();
    if (!d1 || !p1 || !d2 || !p2) return;
    setDealer([d1, d2]);
    setPlayer([p1, p2]);
    setPhase("player");
    setResult("");
  };

  /** 勝敗判定 */
  const judge = (p: Card[], d: Card[]) => {
    const pv = handValue(p);
    const dv = handValue(d);
    if (pv > 21) return "あなたのバースト…負け";
    if (dv > 21) return "ディーラーがバースト！あなたの勝ち";
    if (pv > dv) return "あなたの勝ち";
    if (pv < dv) return "あなたの負け";
    return "引き分け（Push）";
  };

  /** ディーラーの手番：17以上になるまで自動ヒット */
  const dealerTurn = () => {
    setPhase("dealer");
    setDealer(prev => {
      let next = [...prev];
      while (handValue(next) < 17) {
        const c = draw();
        if (!c) break;
        next = [...next, c];
      }
      const res = judge(player, next);
      setResult(res);
      setPhase("result");
      return next;
    });
  };

  /** プレイヤー操作 */
  const onHit = () => {
    if (phase !== "player") return;
    const c = draw();
    if (!c) return;
    const next = [...player, c];
    setPlayer(next);
    if (handValue(next) > 21) {
      // 即負け
      setResult("あなたのバースト…負け");
      setPhase("result");
    }
  };

  const onStand = () => {
    if (phase !== "player") return;
    dealerTurn();
  };

  const onRestart = () => {
    const newDeck = shuffle(createDeck());
    setDeck(newDeck);
    setPos(0);
    setPlayer([]);
    setDealer([]);
    setResult("");
    setPhase("idle");
    // 少し待ってから配ると演出しやすい
    setTimeout(deal, 120);
  };

  /** 初回自動配布 */
  useEffect(() => {
    deal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pv = handValue(player);
  const dv = handValue(dealer);
  const hideDealerHole = phase === "player"; // プレイヤー手番中は伏せる

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: '"Stalinist One", sans-serif' }}>
        BLACKJACK
      </h1>

      {/* ディーラー */}
      <section className="w-full max-w-5xl mb-10">
        <div className="mb-2 flex items-end gap-4">
          <h2 className="text-xl">ディーラー</h2>
          <span className="text-zinc-400 text-sm">
            合計: {hideDealerHole ? "??" : dv}
          </span>
        </div>
        <div className="flex gap-2">
          {dealer.map((c, i) => (
            <CardView key={i} card={c} hidden={hideDealerHole && i === 1} />
          ))}
        </div>
      </section>

      {/* プレイヤー */}
      <section className="w-full max-w-5xl mb-8">
        <div className="mb-2 flex items-end gap-4">
          <h2 className="text-xl">あなた</h2>
          <span className="text-zinc-400 text-sm">合計: {pv}</span>
        </div>
        <div className="flex gap-2">
          {player.map((c, i) => (
            <CardView key={i} card={c} />
          ))}
        </div>
      </section>

      {/* 操作 */}
      <div className="flex gap-3">
        <button
          onClick={onHit}
          disabled={phase !== "player"}
          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40"
        >
          Hit
        </button>
        <button
          onClick={onStand}
          disabled={phase !== "player"}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40"
        >
          Stand
        </button>
        <button
          onClick={onRestart}
          className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        >
          Restart
        </button>
      </div>

      {/* 結果 */}
      {phase === "result" && (
        <div className="mt-6 text-lg">
          <span className="px-3 py-1 rounded bg-zinc-800">
            {result}
          </span>
        </div>
      )}
    </div>
  );
}

/** ===== カード見た目（仮） ===== */
function CardView({ card, hidden = false }: { card: Card; hidden?: boolean }) {
  if (hidden) {
    return (
      <div className="w-16 h-24 rounded-md bg-zinc-900 border border-zinc-700 grid place-items-center">
        <div className="w-12 h-20 rounded bg-gradient-to-br from-zinc-700 to-zinc-600" />
      </div>
    );
  }
  const color = card.suit === "♥" || card.suit === "♦" ? "text-rose-400" : "text-zinc-100";
  return (
    <div className="w-16 h-24 rounded-md bg-zinc-900 border border-zinc-700 grid place-items-center">
      <div className={`text-lg font-semibold ${color}`}>{cardLabel(card)}</div>
    </div>
  );
}
