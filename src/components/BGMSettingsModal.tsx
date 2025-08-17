import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { Slider } from "@/components/ui/slider"

export type BGMSettingsModalProps = {
  open: boolean;
  inline?: boolean;           // trueでabsolute配置
  anchorId?: string;
  bgmEnabled: boolean;
  setBgmEnabled: (v: boolean) => void;
  bgmFile: string;
  setBgmFile: (v: string) => void;
  bgmVolume: number;
  setBgmVolume: (v: number) => void;
  onClose: () => void;
}

const TRACKS = [
  { value: "port.mp3",            label: "Port" },
  { value: "katyusha.mp3",        label: "Katyusha" },
  { value: "russian-roulette.mp3",label: "Roulette" },
  { value: "shashka.mp3",         label: "Shashka" },
]

export default function BGMSettingsModal({
  open, inline, anchorId,
  bgmEnabled, setBgmEnabled,
  bgmFile, setBgmFile,
  bgmVolume, setBgmVolume,
  onClose,
}: BGMSettingsModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [side, setSide] = useState<"left"|"right">("left");

  // inline時：アンカー位置から右側の残り幅を見て左右寄せを決定
  useLayoutEffect(() => {
    if (!open || !inline) return;
    const anchor = anchorId ? document.getElementById(anchorId) : null;
    const rect = anchor?.getBoundingClientRect();
    if (!rect) return;
    const spaceRight = window.innerWidth - rect.left;
    setSide(spaceRight < 520 ? "right" : "left");
  }, [open, inline, anchorId]);

  // Esc で閉じる
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // 外側クリックで閉じる
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!panelRef.current) return
      const path = e.composedPath ? e.composedPath() : []
      if (!path.includes(panelRef.current)) onClose()
    }
    window.addEventListener("mousedown", onDown)
    return () => window.removeEventListener("mousedown", onDown)
  }, [open, onClose])

  if (!open) return null

  const positionClass = inline
    ? (side === "left"
        ? "absolute right-0 top-[calc(100%+8px)] w-[min(92vw,520px)] max-h-[70vh] min-h-[400px]"
        : "absolute left-0  top-[calc(100%+8px)] w-[min(92vw,520px)] max-h-[70vh] min-h-[400px]")
    : "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(98vw,600px)] max-h-[80vh] min-h-[440px]";

  return (
    <>
      {/* オーバーレイ（inline=falseの時のみ） */}
      {!inline && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-[2px]"
          aria-hidden
          onClick={onClose}
        />
      )}

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        id="bgm-modal"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label="BGM 設定"
        className={[
          positionClass,
          "z-[70]",
          "origin-top-left animate-in fade-in-0 zoom-in-95",
          "rounded-2xl",
          "border border-cyan-400/40 ring-2 ring-cyan-400/25",
          "shadow-2xl p-8 flex flex-col justify-between",
          "bg-zinc-900/60" // ボタンと同じグレー背景
        ].join(" ")}
      >
        {/* ネオングラデ枠（装飾） */}
        {/* <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl
                     bg-[linear-gradient(135deg,rgba(34,211,238,.45),rgba(217,70,239,.45))]"
        /> */}

        {/* ヘッダー */}
        <div className="relative z-10 mb-6 flex items-center justify-between min-h-[56px]">
          <h3 className="text-lg font-bold tracking-wider text-cyan-400 drop-shadow w-full text-center"
              style={{ fontFamily: '"Stalinist One", sans-serif' }}>
            BGM SETTINGS
          </h3>
          <button
            className="absolute right-6 top-2/3 -translate-y-1/2 rounded-md px-3 py-2 text-base text-white bg-transparent hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 shadow"
            onClick={onClose}
            aria-label="閉じる"
            style={{ color: '#fff', right: '24px', top: '66%', transform: 'translateY(-50%)', position: 'absolute' }}
          >
            ✕
          </button>
        </div>
        <div className="relative z-10 flex flex-col gap-10 flex-1 items-center justify-center w-full">
          {/* Enable */}
          <div className="flex items-center justify-center gap-4 w-full max-w-md">
            <label htmlFor="bgm-enable" className="text-base text-cyan-400 cursor-pointer select-none" style={{ fontFamily: '"Stalinist One", sans-serif' }}>
              BGM
            </label>
            <input
              id="bgm-enable"
              type="checkbox"
              checked={bgmEnabled}
              onChange={e => setBgmEnabled(e.target.checked)}
              className="w-6 h-6 accent-cyan-400"
            />
          </div>
          {/* Track segmented */}
          <div className="space-y-2 w-full max-w-md">
            <div className="text-base font-semibold text-cyan-400 mb-2 text-center" style={{ fontFamily: '"Stalinist One", sans-serif' }}>TRACKS</div>
            <div className="grid grid-cols-2 gap-4">
              {TRACKS.map(t => {
                const active = t.value === bgmFile
                return (
                  <button
                    key={t.value}
                    onClick={() => setBgmFile(t.value)}
                    className={["relative w-full rounded-xl px-4 py-3 text-base font-bold","border-2 transition-colors backdrop-blur",active?"border-cyan-400 text-white shadow-lg bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20":"border-zinc-700 text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-fuchsia-500/10"].join(" ")}
                    style={{fontFamily: '"Stalinist One", sans-serif',WebkitTextStroke: '1px white',color: '#fff'}}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>
          {/* Volume */}
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto">
              <span className="text-base font-semibold text-cyan-400" style={{ fontFamily: '"Stalinist One", sans-serif' }}>VOLUME</span>
              <span className="text-base tabular-nums text-cyan-400" style={{ fontFamily: '"Stalinist One", sans-serif' }}>{bgmVolume}%</span>
            </div>
            <Slider
              value={[bgmVolume]}
              onValueChange={v => setBgmVolume(v[0])}
              max={100}
              step={1}
              className="w-full min-h-[40px] h-8 [&>span[data-orientation=horizontal]]:h-8 [&>span[data-orientation=horizontal]]:rounded-full [&>span[data-orientation=horizontal]]:bg-white [&>span>span]:h-3 [&>span>span]:rounded-full [&>span>span]:bg-white [&>button]:h-8 [&>button]:w-8 [&>button]:min-w-[32px] [&>button]:min-h-[32px] [&>button]:bg-cyan-400 [&>button]:border-2 [&>button]:border-fuchsia-400 [&>button]:shadow-lg [&>button]:focus-visible:outline-none"
            />
          </div>
        </div>
      </div>
    </>
  )
}
