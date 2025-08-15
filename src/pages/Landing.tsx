import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <main className="relative mx-auto grid min-h-dvh place-items-center px-6">
           <div className="relative min-h-dvh flex items-center justify-center bg-zinc-950 overflow-hidden">
  {/* 三本の縦線：アディダス風（全高） */}
  <div
    className="
      pointer-events-none absolute inset-0 z-0
      flex justify-center
    "
  >
    {/* 中央グループ */}
    <div
      className="
        h-dvh flex items-stretch
        [gap:var(--stripe-gap)]
      "
      style={{
        // 太さ・間隔一括調整できる
        // 例: 幅 6px / 間隔 10px（モバイル）, 幅 10px / 間隔 16px（PC）
        ['--stripe-w' as any]: '24px',
        ['--stripe-gap' as any]: '30px',
      }}
    >
      <span className="block h-full w-[var(--stripe-w)] bg-white rounded-sm [box-shadow:0_0_12px_var(--neon-blue)]" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} />
      <span className="block h-full w-[var(--stripe-w)] bg-white rounded-sm [box-shadow:0_0_14px_var(--neon-pink)]" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} />
      <span className="block h-full w-[var(--stripe-w)] bg-white rounded-sm [box-shadow:0_0_12px_var(--neon-blue)]" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} />
    </div>
  </div>
                {/* 中央タイトル */}
                <div className="text-center">
                    <h1
                        className="font-[Stalinist_One] text-[clamp(2.5rem,7vw,6rem)] tracking-wider text-white [animation:titleGlow_2.2s_ease-in-out_infinite]"
                        style={{ fontFamily: '"Stalinist One", sans-serif' }}
                    >
                        BLACKJACK
                    </h1>

                    {/* 3本ライン */}
                    <div className="mt-8 w-[min(700px,90vw)]">
                        <div className="h-[3px] bg-white/90" />
                        <div
                            className="my-5 h-[3px] bg-white"
                            /* アニメでふわっと光る */
                            style={{ animation: 'neonPulse 2.8s ease-in-out infinite' }}
                        />
                        <div className="h-[3px] bg-white/90" />
                    </div>

                    {/* サブコピー */}
                    <p className="mt-6 text-zinc-400">
                        漆黒に走る三本線。選ぶのは、ヒットか、スタンドか。
                    </p>

                    {/* スタート＆レビューへの導線 */}
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Link
                            to="/game"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800
                       bg-zinc-900 px-6 py-3 text-white transition
                       hover:border-white/40 hover:[filter:drop-shadow(0_0_10px_var(--neon-blue))]"
                        >
                            ▶ Start Game
                        </Link>

                        <Link
                            to="/review"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800
                       px-6 py-3 text-zinc-200 transition
                       hover:border-white/30 hover:text-white hover:[filter:drop-shadow(0_0_8px_var(--neon-pink))]"
                        >
                            <span className="opacity-80">Code Review</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
