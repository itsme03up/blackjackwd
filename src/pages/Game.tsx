// src/pages/Game.tsx
import { useState } from "react";

export default function Game() {
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);

  return (
    
    <div className="min-h-dvh bg-zinc-950 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8">ブラックジャック</h1>

      {/* ディーラー */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">ディーラー</h2>
        <div className="flex gap-2">
          {dealerHand.length ? dealerHand.map((card, i) => (
            <div key={i} className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center">
              {card}
            </div>
          )) : <div className="text-gray-400">カードなし</div>}
        </div>
      </div>

      {/* プレイヤー */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">プレイヤー</h2>
        <div className="flex gap-2">
          {playerHand.length ? playerHand.map((card, i) => (
            <div key={i} className="w-16 h-24 bg-gray-800 rounded flex items-center justify-center">
              {card}
            </div>
          )) : <div className="text-gray-400">カードなし</div>}
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-500">Hit</button>
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Stand</button>
        <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">Restart</button>
      </div>
    </div>
  );
}
