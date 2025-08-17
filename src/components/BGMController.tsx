import { useEffect, useRef } from "react"

export type BGMControllerProps = {
  enabled: boolean
  file: string
  volume: number // 0-100
}

export default function BGMController({ enabled, file, volume }: BGMControllerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.src = `/sounds/${file}`
    audioRef.current.volume = volume / 100
    audioRef.current.loop = true
    if (enabled) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [enabled, file, volume])

  return <audio ref={audioRef} style={{ display: "none" }} />
}
