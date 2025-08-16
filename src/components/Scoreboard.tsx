// src/components/Scoreboard.tsx
import { type FC } from "react";

type Props = {
  balance: number;
  bet: number;
  min?: number;
  max?: number;
  onBetChange: (next: number) => void;
};

export const Scoreboard: FC<Props> = ({ balance, bet, min = 1, max = 999, onBetChange }) => {
  const clamp = (n: number) => Math.max(min, Math.min(max, Math.floor(n)));

  return (
    <aside
      className="
        rounded-2xl border border-zinc-700/60 bg-black/55
        px-4 py-5 text-white shadow-[0_8px_30px_rgba(0,0,0,.35)]
        backdrop-blur-md
        sticky top-24
      "
    >
      <h3 className="text-lg font-semibold tracking-wide mb-3">スコアボード</h3>

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-300">所持金</span>
          <span className="text-xl font-bold tabular-nums">${balance}</span>
        </div>

        <div className="pt-2 border-t border-zinc-700/50">
          <label className="block text-zinc-300 mb-1">ベット額</label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={bet}
              min={min}
              max={max}
              onChange={(e) => onBetChange(clamp(Number(e.target.value || 0)))}
              className="w-24 h-9 px-2 rounded-md text-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button
              type="button"
              onClick={() => onBetChange(clamp(bet + 5))}
              className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
            >
              +5
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => onBetChange(10)}
              className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
            >
              $10
            </button>
            <button
              type="button"
              onClick={() => onBetChange(25)}
              className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
            >
              $25
            </button>
            <button
              type="button"
              onClick={() => onBetChange(50)}
              className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
            >
              $50
            </button>
          </div>
        </div>

        {/* 将来：勝敗履歴など */}
        {/* <div className="pt-2 border-t border-zinc-700/50">
          <div className="text-zinc-300 mb-1">履歴</div>
          <ul className="space-y-1 text-zinc-400">
            <li>+ $10</li>
            <li>- $25</li>
          </ul>
        </div> */}
      </div>
    </aside>
  );
};
