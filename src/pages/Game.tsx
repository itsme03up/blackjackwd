// src/components/Game.tsx
import { useState } from "react";
import { CardSvg } from "../components/CardSvg";
import { cardCode } from "../lib/cardCode";
import { Button } from "../components/ui/button";
import { Scoreboard } from "@/components/Scoreboard";

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
  const [money, setMoney] = useState<number>(100);
  const [bet, setBet] = useState<number>(10);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // カードを引く
  const draw = (hand: Card[], setHand: (h: Card[]) => void, deckArr?: Card[], setDeckArr?: (d: Card[]) => void) => {
    const d = deckArr ?? deck;
    if (d.length === 0) return;
    const [card, ...rest] = d;
    if (setDeckArr) setDeckArr(rest);
    else setDeck(rest);
    setHand([...hand, card]);
  };

  // 初期配布
  const startGame = () => {
    if (money <= 0) {
      setMessage("所持金がありません。ゲーム終了です。");
      setGameOver(true);
      return;
    }
    const newDeck = shuffle(createDeck());
    setDeck(newDeck.slice(4));
    setPlayerHand([newDeck[0], newDeck[2]]);
    setDealerHand([newDeck[1], newDeck[3]]);
    setHideDealerHole(true);
    setMessage("");
    setGameOver(false);
  };

  // ヒット
  const hit = () => {
    if (gameOver || hideDealerHole === false) return;
    draw(playerHand, setPlayerHand);
    setTimeout(() => {
      const val = handValue([...playerHand, deck[0]]);
      if (val > 21) {
        setHideDealerHole(false);
        setMessage("バースト！ディーラーの勝ちです。");
        setMoney(money - bet);
        if (money - bet <= 0) setGameOver(true);
      }
    }, 100);
  };

  // スタンド
  const stand = () => {
    if (gameOver || hideDealerHole === false) return;
    setHideDealerHole(false);
    let dealer = [...dealerHand];
    let currentDeck = [...deck];
    while (handValue(dealer) < 17 && currentDeck.length > 0) {
      dealer.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
    }
    setDeck(currentDeck);
    setDealerHand(dealer);

    const playerVal = handValue(playerHand);
    const dealerVal = handValue(dealer);
    let result = "";
    let newMoney = money;
    if (dealerVal > 21) {
      result = "ディーラーはバースト！プレイヤーの勝ちです。";
      newMoney += bet;
    } else if (playerVal > dealerVal) {
      result = "プレイヤーの勝ちです！";
      newMoney += bet;
    } else if (playerVal < dealerVal) {
      result = "ディーラーの勝ちです。";
      newMoney -= bet;
    } else {
      result = "引き分け！";
    }
    setMessage(result);
    setMoney(newMoney);
    if (newMoney <= 0) setGameOver(true);
  };

  return (
    <div className="relative mx-auto max-w-5xl p-6 text-white grid gap-8 lg:grid-cols-[1fr_280px] min-h-screen overflow-hidden">
    {/* 左側画像 */}
      <img
        src="/images/kwbunny.png"
        alt="kwbunny"
        className="absolute top-[18%] left-[6%] z-20 w-auto max-h-[42vh] min-w-[120px] object-contain pointer-events-none select-none"
      />
    {/* メインカラム */}
    <main className="text-center">

      <h1 className="font-[Stalinist_One] text-[clamp(2rem,4.8vw,4rem)] tracking-wider text-white [animation:titleGlow_2.2s_ease-in-out_infinite] relative z-30" style={{ fontFamily: '"Stalinist One", sans-serif' }}>
        BLACKJACK
      </h1>

      {/* <div className="mb-4 text-lg">所持金: ${money}</div>
      <div className="mb-4 flex flex-col items-center">
        <label htmlFor="bet-input" className="mb-1 text-lg">ベット額:</label>
        <div className="flex justify-center items-center w-full">
          <input
            id="bet-input"
            type="number"
            min={1}
            max={money}
            value={bet}
            disabled={!hideDealerHole || gameOver}
            onChange={e => setBet(Math.max(1, Math.min(money, Number(e.target.value))))}
            className="w-48 h-20 text-4xl px-6 py-4 rounded-2xl text-black border-4 border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-2xl bg-white transition-all duration-200"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div> */}

      {/* ディーラー */}
      <div className="mb-6">
        <h2 className="mb-2">ディーラー</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 content-start">
          {dealerHand.map((c, i) => (
            <CardSvg
              key={i}
              code={cardCode(c.rank, c.suit)}
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
              code={cardCode(c.rank, c.suit)}
              suit={c.suit}
            />
          ))}
        </div>
        <p className="mt-2">合計: {handValue(playerHand)}</p>
      </div>

          {/* 操作ボタン */}
          <div className="mt-6 grid grid-flow-col auto-cols-max gap-5 justify-center">
              <div className="p-[2px]">
                  <Button onClick={startGame} className="neon-btn shadow-lg w-28">スタート</Button>
              </div>
              <div className="p-[2px]">
                  <Button onClick={hit} className="neon-btn shadow-lg w-28">ヒット</Button>
              </div>
              <div className="p-[2px]">
                  <Button onClick={stand} className="neon-btn shadow-lg w-28">スタンド</Button>
              </div>
          </div>

      {message && <p className="mt-4 text-xl">{message}</p>}
      {gameOver && <p className="mt-4 text-2xl text-yellow-300">所持金がなくなりました。ゲーム終了です。</p>}
     </main>
    {/* 右サイド：スコアボード */}
    <aside className="flex flex-col items-center justify-center h-full">
      <Scoreboard
        balance={money}
        bet={bet}
        min={1}
        max={money}
        onBetChange={(v) => setBet(v)}
      />
    </aside>
    </div>

  );
}
