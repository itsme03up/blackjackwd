// src/components/CardSvg.tsx
import { type FC, memo } from 'react'
type Props = { code: string; suit: '♥'|'♦'|'♣'|'♠'; back?: boolean }
import backImg from '/images/card.png' 

const cardModules = import.meta.glob('@/assets/cards/*.svg', { eager: true })

export const CardSvg: FC<Props> = memo(({ code, suit, back }) => {
  // ① ラッパーで“サイズを固定”して、伸びを完全に止める
  const Wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div
      className="
        w-16 h-24               /* 64×96px に固定 */
        shrink-0 grow-0 basis-auto
        overflow-hidden rounded-md
        border border-zinc-700 bg-zinc-900
        grid place-items-center
      "
    >
      {children}
    </div>
  )

  if (back) {
    return (
      <Wrapper>
        <img
          src={backImg}
          alt="card back"
          className="!w-full !h-full object-contain select-none"
          draggable={false}
        />
      </Wrapper>
    )
  }

  const path = `/src/assets/cards/${code}.svg`
  const mod = cardModules[path] as { default: React.FC<React.SVGProps<SVGSVGElement>> } | undefined

  if (!mod) {
    return (
      <Wrapper>
        <span className="text-[10px] text-zinc-400">{code}</span>
      </Wrapper>
    )
  }

  const color = suit === '♥' || suit === '♦' ? 'text-rose-400' : 'text-zinc-100'
  const Svg = mod.default

  return (
    <Wrapper>
      {/* SVGは外側の text-* に追従（currentColor） */}
      <Svg className={`!w-[90%] !h-[90%] ${color} drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]`} />
    </Wrapper>
  )
})
