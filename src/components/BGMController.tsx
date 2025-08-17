import { useEffect, useRef } from "react"

// BGMControllerはBGM再生＋設定UIを管理
export default function BGMController({ bgmEnabled, bgmFile, bgmVolume }: { bgmEnabled: boolean, bgmFile: string, bgmVolume: number }) {
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
    </>
  )
}
