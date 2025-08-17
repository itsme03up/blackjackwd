import { useEffect, useRef, useState } from "react"
import BGMSettingsModal from "@/components/BGMSettingsModal"

// BGMControllerはBGM再生＋設定UIを管理
export default function BGMController() {
  const [open, setOpen] = useState(false)
  const [bgmEnabled, setBgmEnabled] = useState(true)
  const [bgmVolume, setBgmVolume] = useState(60)
  const [bgmFile, setBgmFile] = useState("port.mp3")

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
      <BGMSettingsModal
        open={open}
        bgmEnabled={bgmEnabled}
        setBgmEnabled={setBgmEnabled}
        bgmFile={bgmFile}
        setBgmFile={setBgmFile}
        bgmVolume={bgmVolume}
        setBgmVolume={setBgmVolume}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
