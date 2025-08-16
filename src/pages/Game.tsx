// src/components/Game.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardSvg } from "@/components/CardSvg";
import { cardCode } from "@/lib/cardCode";
import { Button } from "@/components/ui/button";
import { Scoreboard } from "@/components/Scoreboard";
import Navbar from "@/components/Navbar";

type Suit = "♥" | "♦" | "♣" | "♠";
type Card = { suit: Suit; rank: string; value: number };

const createDeck = (): Card[] => {
    const suits: Suit[] = ["♥", "♦", "♣", "♠"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const deck: Card[] = [];
    suits.forEach(s => ranks.forEach((r, i) => deck.push({ suit: s, rank: r, value: values[i] })));
    return deck;
};

const shuffle = (d: Card[]) => {
    const a = [...d]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
};

const handValue = (hand: Card[]) => {
    let total = 0, aces = 0;
    hand.forEach(c => { total += c.value; if (c.rank === "A") aces++; });
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
    const navigate = useNavigate();

    const startGame = () => {
        if (money <= 0) { setMessage("所持金がありません。"); setGameOver(true); return; }
        const d = shuffle(createDeck());
        setDeck(d.slice(4));
        setPlayerHand([d[0], d[2]]);
        setDealerHand([d[1], d[3]]);
        setHideDealerHole(true);
        setMessage(""); setGameOver(false);
    };

    const hit = () => {
        if (gameOver || !hideDealerHole || deck.length === 0) return;
        const [card, ...rest] = deck; setDeck(rest);
        setPlayerHand(prev => {
            const nh = [...prev, card];
            if (handValue(nh) > 21) {
                setHideDealerHole(false);
                setMessage("バースト！ディーラーの勝ちです。");
                setMoney(m => Math.max(0, m - bet));
                if (money - bet <= 0) setGameOver(true);
            }
            return nh;
        });
    };

    const stand = () => {
        if (gameOver || !hideDealerHole) return;
        setHideDealerHole(false);
        let dh = [...dealerHand], d = [...deck];
        while (handValue(dh) < 17 && d.length > 0) { dh.push(d[0]); d = d.slice(1); }
        setDealerHand(dh); setDeck(d);
        const pv = handValue(playerHand), dv = handValue(dh);
        let msg = "引き分け！", cash = money;
        if (dv > 21 || pv > dv) { msg = dv > 21 ? "ディーラーはバースト！プレイヤーの勝ちです。" : "プレイヤーの勝ちです！"; cash += bet; }
        else if (pv < dv) { msg = "ディーラーの勝ちです。"; cash -= bet; }
        setMessage(msg); setMoney(Math.max(0, cash)); if (cash <= 0) setGameOver(true);
    };

    return (
        <>
            <Navbar />
            <div
                className="
            relative mx-auto max-w-3xl p-6 text-white text-center
            /* カードの標準サイズを CSS 変数で強制 */
            [--card-w:4.2rem] [--card-h:6.2rem]
            sm:[--card-w:5rem] sm:[--card-h:7.4rem]
            lg:[--card-w:5.8rem] lg:[--card-h:8.8rem]
            overflow-x-hidden
          "
            >
                {/* うさバニー川田：タイトル左寄り。サイズ抑制＆クリック無効 */}
                <img
                    src="/images/kwbunny.png" alt="kwbunny"
                    className="absolute top-[18%] left-[6%] z-10 w-auto max-h-[38vh] min-w-[110px]
                       object-contain pointer-events-none select-none"
                />

                <h1
                    className="relative z-20 font-[Stalinist_One]
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
                            <CardSvg key={i} code={cardCode(c.rank, c.suit)} suit={c.suit} back={hideDealerHole && i === 1} />
                        ))}
                    </div>
                    {!hideDealerHole && <p className="mt-2">合計: {handValue(dealerHand)}</p>}
                </section>

                {/* プレイヤー */}
                <section className="pt-6 mb-8 flow-root">
                    <h2 className="mb-2">プレイヤー</h2>
                    <div className="flex justify-center items-start gap-2">
                        {playerHand.map((c, i) => (
                            <CardSvg key={i} code={cardCode(c.rank, c.suit)} suit={c.suit} />
                        ))}
                    </div>
                    <p className="mt-2">合計: {handValue(playerHand)}</p>
                </section>

                {/* 操作ボタン */}
                <div className="mt-6 grid grid-flow-col auto-cols-max gap-5 justify-center">
                    <div className="p-[2px]"><Button onClick={startGame} className="neon-btn w-28">スタート</Button></div>
                    <div className="p-[2px]"><Button onClick={hit} className="neon-btn w-28" disabled={!hideDealerHole}>ヒット</Button></div>
                    <div className="p-[2px]"><Button onClick={stand} className="neon-btn w-28" disabled={!hideDealerHole}>スタンド</Button></div>
                </div>

                {message && <p className="mt-4 text-xl">{message}</p>}
                {gameOver && <p className="mt-4 text-2xl text-yellow-300">所持金がなくなりました。ゲーム終了です。</p>}
                {/* 画面左下に固定スコアボード */}
                {/* 画面下固定スコアボード */}
                <div className="
    fixed inset-x-0 bottom-0 z-50
    bg-zinc-900/75 backdrop-blur-md
    border-t border-zinc-700/60
  ">
                    <div className="mx-auto max-w-4xl px-4">
                        <Scoreboard
                            balance={money}
                            bet={bet}
                            min={1}
                            max={money}
                            onBetChange={setBet}
                        />
                    </div>
                    {/* iOS セーフエリア対応 */}
                    <div className="h-[env(safe-area-inset-bottom)]" />
                </div>
            </div>
        </>
    );
}
