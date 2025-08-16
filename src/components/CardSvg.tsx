// src/components/CardSvg.tsx
import { type FC, memo } from 'react'
type Props = { code: string; suit: '♥'|'♦'|'♣'|'♠'; back?: boolean }
import backImg from '/images/card.png' 

const cardModules = import.meta.glob('@/assets/cards/*.svg?component', { eager: true });

export const CardSvg: FC<Props> = memo(({ code, suit, back }) => {
  // ラッパーで“サイズを固定”して、伸びを完全に止める
  const Wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div
      className="
        w-[var(--card-w)] h-[var(--card-h)]
        max-w-[var(--card-w)] max-h-[var(--card-h)]
        shrink-0 grow-0 basis-auto
        overflow-hidden rounded-md
        border border-zinc-700 bg-zinc-900
        grid place-items-center
        "
      // 念のため直接スタイルでも固定（親が強くても勝てる）
    //   style={{ width: "5rem", height: "7rem" }}
    >
      {children}
    </div>
  )
 /** 背面表示 */
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
 /** 表面SVGの解決 */
  const path = `/src/assets/cards/${code}.svg`
  const mod = cardModules[path] as { default: React.FC<React.SVGProps<SVGSVGElement>> } | undefined;

  if (!mod) {
    return (
      <Wrapper>
        <span className="text-[10px] text-zinc-400">{code}</span>
      </Wrapper>
    )
  }
 /** ♥/♦ はピンク、♣/♠ は白系（SVG内は fill/stroke="currentColor" 前提） */
  const color = suit === '♥' || suit === '♦' ? 'text-rose-400' : 'text-zinc-100'
  const Svg = cardModules[path] as React.FC<React.SVGProps<SVGSVGElement>> | undefined;

  return (
    <Wrapper>
      {/* SVGは外側の text-* に追従（currentColor） */}
      {Svg ? (
        <Svg className={`!w-[90%] !h-[90%] ${color} drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]`} />
      ) : (
        <span className="text-[10px] text-zinc-400">{code}</span>
      )}
    </Wrapper>
  )
})
