// src/components/CardSvg.tsx
import { type FC, memo } from 'react'

// 例: "AH" / "TD" / "KS"
type Props = { code: string; suit: '♥'|'♦'|'♣'|'♠'; back?: boolean }
import backImg from '@/image/card.png'

// 動的 import（SVGR）: /src/assets/cards/{code}.svg を ReactComponent として読み込み
// Vite の import.meta.glob を使うと綺麗にいけます
const cardModules = import.meta.glob('@/assets/cards/*.svg', { eager: true })

export const CardSvg: FC<Props> = memo(({ code, suit, back }) => {
  if (back) {
    return (
      <img
        src={backImg}
        alt="card-back"
        className="w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 object-contain"
        draggable={false}
      />
    )
  }

  const path = `/src/assets/cards/${code}.svg`
  const mod = cardModules[path] as { default: React.FC<React.SVGProps<SVGSVGElement>> } | undefined

  if (!mod) {
    return (
      <div className="w-16 h-24 grid place-items-center rounded-md border border-zinc-700 bg-zinc-900 text-xs text-zinc-400">
        {code}
      </div>
    )
  }

  // ♥/♦ はピンク、♣/♠ は白系
  const color = suit === '♥' || suit === '♦' ? 'text-rose-400' : 'text-zinc-100'

  const Svg = mod.default
  return (
    <div className={`w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 grid place-items-center ${color}`}>
      {/* SVG内の fill/stroke="currentColor" が外側の text-* に同期 */}
      <Svg className="w-[90%] h-[90%] drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" />
    </div>
  )
})
