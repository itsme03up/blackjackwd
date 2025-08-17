import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

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
      if (!panelRef.current.contains(e.target as Node)) onClose()
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
          "max-w-full",
          "overflow-x-auto",
          "z-[70] w-[min(92vw,420px)]",
          "origin-top-left animate-in fade-in-0 zoom-in-95",
          "rounded-2xl bg-zinc-900/80 backdrop-blur-xl",
          "border border-zinc-700/60 ring-1 ring-cyan-400/25",
          "shadow-[0_0_40px_rgba(34,211,238,.22)] p-5 sm:p-6"
        ].join(" ")}
      >
        {/* ネオングラデ枠（装飾） */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-50 blur
                     bg-[linear-gradient(135deg,rgba(34,211,238,.45),rgba(217,70,239,.45))]"
        />

        {/* ヘッダー */}
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wider text-cyan-300"
              style={{ fontFamily: '"Stalinist One", sans-serif' }}>
            BGM SETTINGS
          </h3>
          <button
            className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:text-white
                       hover:bg-zinc-800/60 focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* ボディ */}
        <div className="relative z-10 space-y-6">
          {/* Enable */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200">BGM を再生</span>
            <Switch checked={bgmEnabled} onCheckedChange={setBgmEnabled} />
          </div>

          {/* Track segmented */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-200">トラック</div>
            <div className="grid grid-cols-2 gap-2">
              {TRACKS.map(t => {
                const active = t.value === bgmFile
                return (
                  <button
                    key={t.value}
                    onClick={() => setBgmFile(t.value)}
                    className={[
                      "relative w-full rounded-lg px-3 py-2 text-sm",
                      "border transition-colors",
                      active
                        ? "border-cyan-400/50 bg-zinc-800/80 text-white shadow-[0_0_20px_rgba(34,211,238,.2)]"
                        : "border-zinc-700/60 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800/50"
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">ボリューム</span>
              <span className="text-xs tabular-nums text-zinc-300">{bgmVolume}%</span>
            </div>
            <Slider
              value={[bgmVolume]}
              onValueChange={v => setBgmVolume(v[0])}
              max={100}
              step={1}
              className="
                w-full
                [&>span[data-orientation=horizontal]]:h-2
                [&>span[data-orientation=horizontal]]:rounded-full
                [&>span[data-orientation=horizontal]]:bg-zinc-700/70
                [&>span>span]:h-full
                [&>span>span]:bg-gradient-to-r [&>span>span]:from-cyan-400 [&>span>span]:to-fuchsia-500
                [&>span>span]:rounded-full
                [&>button]:h-4 [&>button]:w-4 [&>button]:bg-white
                [&>button]:border [&>button]:border-cyan-300
                [&>button]:shadow
                [&>button]:focus-visible:outline-none
              "
            />
          </div>
        </div>
      </div>
    </>
  )
}
