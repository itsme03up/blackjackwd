// src/components/Game.tsx
import { useState } from "react";
import { CardSvg } from "../components/CardSvg";

type Card = {
  suit: "♥" | "♦" | "♣" | "♠";
  rank: string;
  value: number;
};

// デッキを生成
const createDeck = (): Card[] => {
  const suits: Card["suit"][] = ["♥", "♦", "♣", "♠"];
  const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const values = [11,2,3,4,5,6,7,8,9,10,10,10,10];
  const deck: Card[] = [];
  suits.forEach(suit => {
    ranks.forEach((rank, i) => {
      deck.push({ suit, rank, value: values[i] });
    });
  });
  return deck;
};

// シャッフル
const shuffle = (deck: Card[]): Card[] => {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// 手札の合計値
const handValue = (hand: Card[]): number => {
  let total = 0;
  let aces = 0;
  hand.forEach(c => {
    total += c.value;
    if (c.rank === "A") aces++;
  });
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
};

export default function Game() {
  const [deck, setDeck] = useState<Card[]>(shuffle(createDeck()));
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [hideDealerHole, setHideDealerHole] = useState(true);
  const [message, setMessage] = useState("");

  // カードを引く
  const draw = (hand: Card[], setHand: (h: Card[]) => void) => {
    if (deck.length === 0) return;
    const [card, ...rest] = deck;
    setDeck(rest);
    setHand([...hand, card]);
  };

  // 初期配布
  const startGame = () => {
    const newDeck = shuffle(createDeck());
    setDeck(newDeck.slice(4));
    setPlayerHand([newDeck[0], newDeck[2]]);
    setDealerHand([newDeck[1], newDeck[3]]);
    setHideDealerHole(true);
    setMessage("");
  };

  // ヒット
  const hit = () => {
    draw(playerHand, setPlayerHand);
  };

  // スタンド
  const stand = () => {
    setHideDealerHole(false);
    const dealer = [...dealerHand];
    while (handValue(dealer) < 17) {
      const [card, ...rest] = deck;
      dealer.push(card);
      setDeck(rest);
    }
    setDealerHand(dealer);

    const playerVal = handValue(playerHand);
    const dealerVal = handValue(dealer);
    if (dealerVal > 21 || playerVal > dealerVal) {
      setMessage("プレイヤー勝利！");
    } else if (playerVal < dealerVal) {
      setMessage("ディーラー勝利！");
    } else {
      setMessage("引き分け！");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 text-center text-white">
      <h1 className="text-2xl font-bold mb-4">ブラックジャック</h1>

      {/* ディーラー */}
      <div className="mb-6">
        <h2 className="mb-2">ディーラー</h2>
        <div className="flex justify-center gap-2">
          {dealerHand.map((c, i) => (
            <CardSvg
              key={i}
              code={`${c.rank}${c.suit}`}   // 例: "A♥"
              suit={c.suit}
              back={hideDealerHole && i === 1}
            />
          ))}
        </div>
        {!hideDealerHole && (
          <p className="mt-2">合計: {handValue(dealerHand)}</p>
        )}
      </div>

      {/* プレイヤー */}
      <div className="mb-6">
        <h2 className="mb-2">プレイヤー</h2>
        <div className="flex justify-center gap-2">
          {playerHand.map((c, i) => (
            <CardSvg
              key={i}
              code={`${c.rank}${c.suit}`}
              suit={c.suit}
            />
          ))}
        </div>
        <p className="mt-2">合計: {handValue(playerHand)}</p>
      </div>

      {/* 操作ボタン */}
      <div className="space-x-3">
        <button onClick={startGame} className="px-4 py-2 bg-green-600 rounded">
          スタート
        </button>
        <button onClick={hit} className="px-4 py-2 bg-blue-600 rounded">
          ヒット
        </button>
        <button onClick={stand} className="px-4 py-2 bg-red-600 rounded">
          スタンド
        </button>
      </div>

      {message && <p className="mt-4 text-xl">{message}</p>}
    </div>
  );
}
