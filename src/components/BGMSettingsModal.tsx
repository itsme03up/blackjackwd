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

  useLayoutEffect(() => {
    if (!open || !inline) return;
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.left;
    setSide(spaceRight < 420 ? "right" : "left");
  }, [open, inline]);

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

  const positionClass = "fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[min(98vw,600px)] h-[min(90vh,480px)]";

  return (
    <>
      {/* inline時はオーバーレイ無し */}
      {!inline && <div className="fixed inset-0 z-[60]" aria-hidden />}

      <div
        ref={panelRef}
        role="dialog"
        aria-label="BGM 設定"
        className={[
          positionClass,
          "z-[70]",
          "origin-top-left animate-in fade-in-0 zoom-in-95",
          "rounded-2xl bg-black", // ← 完全不透明な黒背景
          "border border-cyan-400/40 ring-2 ring-cyan-400/25",
          "shadow-2xl p-8 flex flex-col justify-between"
        ].join(" ")}
      >
        {/* ネオングラデ枠（装飾） */}
        {/* <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl
                     bg-[linear-gradient(135deg,rgba(34,211,238,.45),rgba(217,70,239,.45))]"
        /> */}

        {/* ヘッダー */}
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-wider text-cyan-400 drop-shadow"
              style={{ fontFamily: '"Stalinist One", sans-serif' }}>
            BGM SETTINGS
          </h3>
          <button
            className="rounded-md px-3 py-2 text-base text-white bg-cyan-600 hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 shadow"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* ボディ */}
        <div className="relative z-10 flex flex-col gap-8 flex-1">
          {/* Enable */}
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-cyan-400">BGM を再生</span>
            {/* <Switch checked={bgmEnabled} onCheckedChange={setBgmEnabled} /> */}
            <input
              type="checkbox"
              checked={bgmEnabled}
              onChange={e => setBgmEnabled(e.target.checked)}
              className="w-6 h-6 accent-cyan-400"
            />
          </div>

          {/* Track segmented */}
          <div className="space-y-2">
            <div className="text-base font-semibold text-cyan-400 mb-2">トラック</div>
            <div className="grid grid-cols-2 gap-4">
              {TRACKS.map(t => {
                const active = t.value === bgmFile
                return (
                  <button
                    key={t.value}
                    onClick={() => setBgmFile(t.value)}
                    className={[
                      "relative w-full rounded-xl px-4 py-3 text-base font-bold",
                      "border-2 transition-colors backdrop-blur",
                      active
                        ? "border-cyan-400 bg-transparent text-white shadow-lg"
                        : "border-zinc-700 bg-transparent text-white hover:bg-cyan-800/40"
                    ].join(" ")}
                    style={{
                      fontFamily: '"Stalinist One", sans-serif',
                      WebkitTextStroke: '1px white',
                      color: '#fff'
                    }}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-cyan-400">ボリューム</span>
              <span className="text-base tabular-nums text-cyan-400">{bgmVolume}%</span>
            </div>
            <Slider
              value={[bgmVolume]}
              onValueChange={v => setBgmVolume(v[0])}
              max={100}
              step={1}
              className="w-full min-h-[40px] h-8 [&>span[data-orientation=horizontal]]:h-8 [&>span[data-orientation=horizontal]]:rounded-full [&>span[data-orientation=horizontal]]:bg-cyan-700 [&>span>span]:h-full [&>span>span]:bg-gradient-to-r [&>span>span]:from-cyan-400 [&>span>span]:to-fuchsia-500 [&>span>span]:rounded-full [&>button]:h-8 [&>button]:w-8 [&>button]:bg-white [&>button]:border-2 [&>button]:border-cyan-400 [&>button]:shadow-lg [&>button]:focus-visible:outline-none"
            />
          </div>
        </div>
      </div>
    </>
  )
}
