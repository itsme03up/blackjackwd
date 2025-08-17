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
        <div className="leading-tight text-center w-full flex flex-col items-center" style={{ fontFamily: '"Stalinist One", sans-serif' }}>
          <div className="text-[11px] tracking-[0.18em] text-zinc-400">BALANCE</div>
          <div className="text-2xl font-semibold tabular-nums">$ {balance}</div>
        </div>
      </div>

      {/* BET（テンキー入力） */}
      <div className="flex items-center gap-3 w-full justify-center">
        <div className="text-[11px] tracking-[0.18em] text-zinc-400 text-left flex flex-col justify-center" style={{ fontFamily: '"Stalinist One", sans-serif' }}>BET</div>
        <input
          type="number"
          inputMode="decimal"
          pattern="[0-9]*"
          value={bet}
          min={min}
          max={max}
          onChange={(e) => onBetChange(clamp(Number(e.target.value)))}
          className="
            w-36 h-12
            bg-zinc-900/60 border border-zinc-700/40 rounded-lg px-4 text-xl text-center font-bold tabular-nums text-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.12)]
            outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all
          "
        />
      </div>

      {/* 上側うす線（装飾） */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent" />
    </div>
  );
};
