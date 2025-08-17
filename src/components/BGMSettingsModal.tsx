import { Slider } from "@/components/ui/slider"
import React from "react"

export type BGMSettingsModalProps = {
  open: boolean
  popRef: React.RefObject<HTMLDivElement | null>
  bgmEnabled: boolean
  setBgmEnabled: (v: boolean) => void
  bgmFile: string
  setBgmFile: (v: string) => void
  bgmVolume: number
  setBgmVolume: (v: number) => void
  onClose: () => void
}

export default function BGMSettingsModal({
  open,
  popRef,
  bgmEnabled,
  setBgmEnabled,
  bgmFile,
  setBgmFile,
  bgmVolume,
  setBgmVolume,
  onClose,
}: BGMSettingsModalProps) {
  if (!open) return null
  return (
    <div
      id="bgm-popover"
      ref={popRef}
      role="dialog"
      aria-label="BGM設定"
      className="
        absolute right-full top-full mt-2 mr-2
        min-w-[320px] max-w-md min-h-[340px]
        rounded-xl bg-black !bg-black !opacity-100 ring-1 ring-cyan-400/30 shadow-2xl
        p-6 z-50 flex flex-col justify-between
      "
      style={{ background: '#000', opacity: 1 }}
    >
      <div className="mb-6 text-cyan-300 font-semibold text-xs tracking-wider" style={{ fontFamily: 'Stalinist One, sans-serif' }}>BGM 設定</div>
      <div className="flex flex-col gap-8 flex-1">
        <label className="flex items-center gap-2 text-zinc-200 text-xs font-semibold">
          <input type="checkbox" checked={bgmEnabled} onChange={e => setBgmEnabled(e.target.checked)} />
          BGMを流す
        </label>
        <label className="flex flex-col gap-2 text-zinc-200 text-xs font-semibold">
          <span>BGM選択</span>
          <select
            className="bg-zinc-800 text-zinc-100 rounded px-2 py-1"
            value={bgmFile}
            onChange={e => setBgmFile(e.target.value)}
          >
            <option value="port.mp3">port.mp3</option>
            <option value="katyusha.mp3">katyusha.mp3</option>
            <option value="russian-roulette.mp3">russian-roulette.mp3</option>
            <option value="shashka.mp3">shashka.mp3</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-zinc-200 text-xs font-semibold">
          <span>ボリューム</span>
          <div className="w-full flex items-center justify-center">
            <Slider
              value={[bgmVolume]}
              onValueChange={v => setBgmVolume(v[0])}
              max={100}
              step={1}
              className="w-full max-w-md my-4
                [&>span[data-orientation=horizontal]]:h-1.5
                [&>span[data-orientation=horizontal]]:w-full
                [&>span[data-orientation=horizontal]]:bg-zinc-700/70
                [&>span[data-orientation=horizontal]]:rounded-full
                [&>span>span]:h-full
                [&>span>span]:bg-gradient-to-r [&>span>span]:from-cyan-400 [&>span>span]:to-fuchsia-500
                [&>span>span]:rounded-full
                [&>button]:h-3.5 [&>button]:w-3.5
                [&>button]:bg-white [&>button]:shadow
                [&>button]:border [&>button]:border-zinc-300
                [&>button]:focus-visible:outline-none"
            />
          </div>
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          className="neon-btn px-3 py-1.5 rounded-md text-xs font-semibold mt-6"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  )
}
