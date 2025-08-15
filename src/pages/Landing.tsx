import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="relative mx-auto grid min-h-dvh place-items-center px-6">
      {/* 中央タイトル */}
      <div className="text-center">
        <h1
          className="font-[Stalinist_One] text-4xl sm:text-6xl tracking-wider text-white
                     [animation:titleGlow_2.2s_ease-in-out_infinite]"
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
    </main>
  )
}
