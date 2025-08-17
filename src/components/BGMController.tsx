import { useEffect, useRef, useState } from "react"
import BGMSettingsModal from "@/components/BGMSettingsModal"

// BGMControllerはBGM再生＋設定UIを管理
export default function BGMController({ bgmEnabled, bgmFile, bgmVolume }: { bgmEnabled: boolean, bgmFile: string, bgmVolume: number }) {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.src = `/sounds/${bgmFile}`
    audioRef.current.volume = bgmVolume / 100
    audioRef.current.loop = true
    if (bgmEnabled) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [bgmEnabled, bgmFile, bgmVolume])

  return (
    <>
      <audio ref={audioRef} style={{ display: "none" }} />
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="bgm-modal"
        onClick={() => setOpen(true)}
        style={{ fontFamily: '"Stalinist One", sans-serif' }}
        className="neon-btn text-xs tracking-wider font-mono text-cyan-300 hover:text-cyan-200 px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 transition"
      >
        BGM
      </button>
    </>
  )
}
