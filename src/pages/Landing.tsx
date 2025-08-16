import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

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
                    <div className="flex flex-col items-center justify-center gap-2 relative">
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 z-40 w-[240px] h-[240px] pointer-events-none">
                            <div className="w-full h-full rounded-full bg-white/80 blur-[60px]" />
                        </div>
                        <img
                            src="/images/gopnikwd.png"
                            alt="gopnikwd"
                            className="absolute left-1/2 top-0 -translate-x-1/2 z-30 w-[220px] h-[220px] object-contain drop-shadow-lg"
                            style={{ pointerEvents: 'none' }}
                        />
                        <h1
                            className="font-[Stalinist_One] text-[clamp(2.5rem,7vw,6rem)] tracking-wider text-white [animation:titleGlow_2.2s_ease-in-out_infinite] relative z-20"
                            style={{ fontFamily: '"Stalinist One", sans-serif' }}
                        >
                            BLACKJACK
                        </h1>
                    </div>

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

                    {/* サブコピー
                    <p className="mt-6 text-zinc-400">
                        漆黒に走る三本線。選ぶのは、ヒットか、スタンドか。
                    </p> */}

                    {/* スタート＆レビューへの導線（shadcn/uiボタン・縦並び） */}

                    <div className="mt-10 grid gap-6 justify-items-center w-full max-w-[270px] mx-auto relative z-50">
                        <Link to="/game" className="w-full">
                            <Button
                                variant="default"
                                size="lg"
                                className="neon-btn text-lg w-full" style={{ margin: '0.5em 0', padding: '0.75em 2em' }}
                            >
                                ▶ Start Game
                            </Button>
                        </Link>

                        <Link to="/review" className="w-full">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="neon-btn text-lg w-full" style={{ margin: '0.5em 0', padding: '0.75em 2em' }}
                            >
                                Code Review
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    )
}
