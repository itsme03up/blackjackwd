import React from "react";

type Props = {
  balance: number;
  bet: number;
  min: number;
  max: number;
  onBetChange: (v: number) => void;
};

export const Scoreboard: React.FC<Props> = ({
  balance, bet, min, max, onBetChange,
}) => {
  const clamp = (n: number) => Math.max(min, Math.min(max, Math.floor(n || 0)));

  return (
    <div
      className="
        relative
        grid grid-cols-2 gap-4 items-center
        py-3
      "
      // うっすら上グラデのネオン差し色
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 50%)",
      }}
    >
      {/* BALANCE */}
      <div className="flex items-center gap-3">
        <div className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        <div className="leading-tight">
          <div className="text-[11px] tracking-[0.18em] text-zinc-400">BALANCE</div>
          <div className="text-2xl font-semibold tabular-nums">$ {balance}</div>
        </div>
      </div>

      {/* BET（テンキー入力） */}
      <div className="flex items-center justify-end gap-3">
        <div className="text-[11px] tracking-[0.18em] text-zinc-400">BET</div>
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={bet}
          min={min}
          max={max}
          onChange={(e) => onBetChange(clamp(Number(e.target.value)))}
          className="
            w-28 h-10
            text-right text-xl tabular-nums
            px-3 rounded-lg
            bg-zinc-950/60 text-white
            border border-yellow-400/60
            outline-none
            focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/40
          "
        />
      </div>

      {/* 上側うす線（装飾） */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent" />
    </div>
  );
};
