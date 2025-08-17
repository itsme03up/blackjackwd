import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CardSvg } from "@/components/CardSvg";
import { cardCode } from "@/lib/cardCode";
import { Button } from "@/components/ui/button";
import { Scoreboard } from "@/components/Scoreboard";
import Layout from "@/components/layout";

type Suit = "♥" | "♦" | "♣" | "♠";
type Card = { suit: Suit; rank: string; value: number };

// デッキ生成
const createDeck = (): Card[] => {
  const suits: Suit[] = ["♥", "♦", "♣", "♠"];
  const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const values = [11,2,3,4,5,6,7,8,9,10,10,10,10];
  const deck: Card[] = [];
  suits.forEach(s => ranks.forEach((r, i) => deck.push({ suit: s, rank: r, value: values[i] })));
  return deck;
};

// シャッフル
const shuffle = (d: Card[]) => {
  const a = [...d];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 手札合計（Aは11→1に調整）
const handValue = (hand: Card[]) => {
  let total = 0, aces = 0;
  for (const c of hand) { total += c.value; if (c.rank === "A") aces++; }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
};

export default function Game() {
  const [deck, setDeck] = useState<Card[]>(shuffle(createDeck()));
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [hideDealerHole, setHideDealerHole] = useState(true);
  const [message, setMessage] = useState("");
  const [money, setMoney] = useState(100);
  const [bet, setBet] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  // ゲーム開始（初期配布）
  const startGame = () => {
    if (money <= 0) {
      setMoney(100); // 所持金リセット
      setBet(10);   // ベットも初期化（必要なら）
    }
    const d = shuffle(createDeck());
    setDeck(d.slice(4));
    setPlayerHand([d[0], d[2]]);
    setDealerHand([d[1], d[3]]);
    setHideDealerHole(true);
    setMessage("");
    setGameOver(false);
  };

  // ヒット
  const hit = () => {
    if (gameOver || !hideDealerHole || deck.length === 0) return;
    const [card, ...rest] = deck;
    setDeck(rest);
    setPlayerHand(prev => {
      const nh = [...prev, card];
      if (handValue(nh) > 21) {
        setHideDealerHole(false);
        setMessage("バースト！ディーラーの勝ちです。");
        setMoney(m => {
          const cash = Math.max(0, m - bet);
          if (cash <= 0) setGameOver(true);
          return cash;
        });
      }
      return nh;
    });
  };

  // スタンド
  const stand = () => {
    if (gameOver || !hideDealerHole) return;
    setHideDealerHole(false);

    let dh = [...dealerHand];
    let d = [...deck];
    while (handValue(dh) < 17 && d.length > 0) {
      dh.push(d[0]); d = d.slice(1);
    }
    setDealerHand(dh);
    setDeck(d);

    const pv = handValue(playerHand);
    const dv = handValue(dh);

    setMoney(m => {
      let cash = m;
      let msg = "引き分け！";
      if (dv > 21 || pv > dv) {
        msg = dv > 21 ? "ディーラーはバースト！プレイヤーの勝ちです。" : "プレイヤーの勝ちです！";
        cash = m + bet;
      } else if (pv < dv) {
        msg = "ディーラーの勝ちです。";
        cash = Math.max(0, m - bet);
      }
      setMessage(msg);
      if (cash <= 0) setGameOver(true);
      return cash;
    });
  };

  const canHit   = hideDealerHole && !gameOver && deck.length > 0;
  const canStand = hideDealerHole && !gameOver;

  return (
    <Layout>
      <div
        className="
          relative mx-auto max-w-3xl min-h-[calc(100dvh-64px)] flex flex-col justify-start text-white text-center
          [--card-w:3.8rem] [--card-h:5.6rem]
          sm:[--card-w:4.4rem] sm:[--card-h:6.6rem]
          lg:[--card-w:5rem] lg:[--card-h:7.6rem]
          overflow-x-hidden
          p-2 pb-24
        "
      >
        {/* うさバニー川田：左上、クリック無効 */}
        <img

          src="/images/kwbunny.png"
          alt="kwbunny"
          className="absolute top-[18%] left-[6%] z-50 w-auto max-h-[60vh] min-w-[200px] object-contain pointer-events-none select-none"
        />
        {(message === "プレイヤーの勝ちです！" || message === "ディーラーはバースト！プレイヤーの勝ちです。") && (
          <div className="absolute left-[6%] top-[10%] z-30 pointer-events-none">
            <DotLottieReact
              src="https://lottie.host/fbac7aa6-9403-4021-81a4-d5f89c262d0d/aCLTFcreGF.lottie"
              loop
              autoplay
              style={{ width: 240, height: 180 }}
            />
          </div>
        )}

        {/* タイトル（見出しの外マージン抑止） */}
        <h1
          className="relative z-20 m-0 font-[Stalinist_One]
                     text-[clamp(2rem,4.6vw,3.8rem)] tracking-wider
                     [animation:titleGlow_2.2s_ease-in-out_infinite]"
          style={{ fontFamily: '"Stalinist One", sans-serif' }}
        >
          BLACKJACK
        </h1>

        {/* ディーラー */}
        <section className="pt-6 mb-6 flow-root">
          <h2 className="mt-0 mb-2">ディーラー</h2>
          <div className="flex flex-wrap justify-center items-start gap-2">
            {dealerHand.map((c, i) => (
              <CardSvg
                key={i}
                code={cardCode(c.rank, c.suit)}
                suit={c.suit}
                back={hideDealerHole && i === 1}
              />
            ))}
          </div>
          {!hideDealerHole && <p className="mt-2">合計: {handValue(dealerHand)}</p>}
        </section>

        {/* プレイヤー */}
        <section className="pt-6 mb-8 flow-root">
          <h2 className="mt-0 mb-2">プレイヤー</h2>
          <div className="flex justify-center items-start gap-2">
            {playerHand.map((c, i) => (
              <CardSvg key={i} code={cardCode(c.rank, c.suit)} suit={c.suit} />
            ))}
          </div>
          <p className="mt-2">合計: {handValue(playerHand)}</p>
        </section>

        {/* 操作ボタン */}
        <div className="mt-6 grid grid-flow-col auto-cols-max gap-5 justify-center">
          <div className="p-[2px]">
            <Button onClick={startGame} className="neon-btn w-28">スタート</Button>
          </div>
          <div className="p-[2px]">
            <Button onClick={hit} className="neon-btn w-28" disabled={!canHit}>ヒット</Button>
          </div>
          <div className="p-[2px]">
            <Button onClick={stand} className="neon-btn w-28" disabled={!canStand}>スタンド</Button>
          </div>
          <div className="p-[2px]">
            <Button onClick={startGame} className="neon-btn w-28">もう一回遊ぶ</Button>
          </div>
        </div>

        {message && <p className="mt-4 text-xl" role="status" aria-live="polite">{message}</p>}
        {(message === "プレイヤーの勝ちです！" || message === "ディーラーはバースト！プレイヤーの勝ちです。") && (
          <div className="absolute top-0 left-0 w-full flex justify-center z-50" style={{ pointerEvents: 'none' }}>
          </div>
        )}
        {gameOver && <p className="mt-4 text-2xl text-yellow-300">所持金がなくなりました。ゲーム終了です。</p>}

        {/* 画面下中央固定スコアボード */}
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[max(0px,env(safe-area-inset-bottom))] z-50 w-full max-w-4xl px-4 pointer-events-none">
          <div className="bg-zinc-900/75 backdrop-blur-md border-t border-zinc-700/60 rounded-xl px-4 py-2 shadow-lg pointer-events-auto">
            <Scoreboard
              balance={money}
              bet={bet}
              min={1}
              max={money}
              onBetChange={setBet}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
