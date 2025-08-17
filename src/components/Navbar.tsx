// src/components/Navbar.tsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export default function Navbar() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [open, setOpen] = useState(false)
    const [bgmEnabled, setBgmEnabled] = useState(true)
    const [bgmVolume, setBgmVolume] = useState(60)
    const [bgmFile, setBgmFile] = useState("port.mp3")
    const popRef = useRef<HTMLDivElement>(null)
    const { pathname } = useLocation()

    // ルート遷移時は自動的に閉じる
    useEffect(() => setOpen(false), [pathname])

    // BGM再生・音量・選択・有効化（モーダル開閉に依存しない）
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.src = `/sounds/${bgmFile}`;
        audioRef.current.volume = bgmVolume / 100;
        audioRef.current.loop = true;
        if (bgmEnabled) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [bgmEnabled, bgmFile, bgmVolume]);
    // Esc と外クリックで閉じる
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
        const onClick = (e: MouseEvent) => {
            if (!popRef.current) return
            if (!popRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("keydown", onKey)
        document.addEventListener("mousedown", onClick)
        return () => {
            document.removeEventListener("keydown", onKey)
            document.removeEventListener("mousedown", onClick)
        }
    }, [])

    return (
        <>
            {/* BGM再生は常にレンダリング */}
            <audio ref={audioRef} style={{ display: 'none' }} />
            <header className="
      sticky top-0 z-50
      bg-black/70 backdrop-blur-md
      border-b border-zinc-800/70
    ">
            <div className="
        mx-auto max-w-7xl
        h-14 flex items-center justify-between
        px-6 sm:px-10 lg:px-16
      ">
                {/* 左：ブランド + メニュー */}
                <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
                    <Link
                        to="/"
                        className="
                font-[Stalinist_One] tracking-[0.25em]
                text-[13px] sm:text-sm text-zinc-100 hover:text-white
                [text-shadow:0_0_18px_rgba(56,189,248,.35)]
              "
                        style={{ fontFamily: '"Stalinist One", sans-serif' }}
                    >
                        BLACKJACKWD
                    </Link>
                    {/* 小画面で溢れたら横スクロール */}
                    <NavigationMenu>
                        <NavigationMenuList className="flex items-center gap-5 md:gap-7 overflow-x-auto scrollbar-none" style={{ fontFamily: '"Stalinist One", sans-serif' }}>
                            {[
                                { to: "/game", label: "Game" },
                                { to: "/review", label: "Code Review" },
                                { to: "/log", label: "Dev Log" },
                            ].map(({ to, label }) => (
                                <NavigationMenuItem key={to}>
                                    <NavLink
                                        to={to}
                                        className={({ isActive }) =>
                                            cn(
                                                "px-2.5 md:px-3 py-1 rounded-md text-sm",
                                                "text-zinc-300/90 hover:text-white transition-colors",
                                                "outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40",
                                                isActive &&
                                                "text-white bg-zinc-900/60 ring-1 ring-zinc-700/60 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-gradient-to-r after:from-cyan-400 after:to-fuchsia-500"
                                            )
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* 右：BGM コントローラ */}
                <div className="relative flex items-center">
                    <button
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        aria-controls="bgm-popover"
                        onClick={() => setOpen((v) => !v)}
                        style={{ fontFamily: '"Stalinist One", sans-serif' }}
                        className="neon-btn
                text-xs tracking-wider font-mono
                text-cyan-300 hover:text-cyan-200
                px-2 py-1 rounded-md
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40
                transition
              "
                    >
                        BGM
                    </button>
                    {open && (
                        <div
                            id="bgm-popover"
                            ref={popRef}
                            role="dialog"
                            aria-label="BGM設定"
                            className="
                  absolute right-full top-full mt-2 mr-2
                  min-w-[320px] max-w-md min-h-[340px]
                  rounded-xl bg-black !bg-black !opacity-100 ring-1 ring-cyan-400/30 shadow-2xl
                  p-6 z-50 flex flex-col justify-between
                "
                            style={{ background: '#000', opacity: 1 }}
                        >
                            <div className="mb-6 text-cyan-300 font-semibold text-xs tracking-wider" style={{ fontFamily: '"Stalinist One", sans-serif' }}>BGM 設定</div>
                            <div className="flex flex-col gap-8 flex-1">
                              <label className="flex items-center gap-2 text-zinc-200 text-xs font-semibold">
                                <input type="checkbox" checked={bgmEnabled} onChange={e => setBgmEnabled(e.target.checked)} />
                                BGMを流す
                              </label>
                              <label className="flex flex-col gap-2 text-zinc-200 text-xs font-semibold">
                                <span>BGM選択</span>
                                <select
                                  className="bg-zinc-800 text-zinc-100 rounded px-2 py-1"
                                  value={bgmFile}
                                  onChange={e => setBgmFile(e.target.value)}
                                >
                                  <option value="port.mp3">port.mp3</option>
                                  <option value="katyusha.mp3">katyusha.mp3</option>
                                  <option value="russian-roulette.mp3">russian-roulette.mp3</option>
                                  <option value="shashka.mp3">shashka.mp3</option>
                                </select>
                              </label>
                              <label className="flex flex-col gap-2 text-zinc-200 text-xs font-semibold">
                                <span>ボリューム</span>
                                <div className="w-full flex items-center justify-center">
                                  <Slider
                                    value={[bgmVolume]}
                                    onValueChange={v => setBgmVolume(v[0])}
                                    max={100}
                                    step={1}
                                    className="w-full max-w-md my-4
                                      [&>span[data-orientation=horizontal]]:h-1.5
                                      [&>span[data-orientation=horizontal]]:w-full
                                      [&>span[data-orientation=horizontal]]:bg-zinc-700/70
                                      [&>span[data-orientation=horizontal]]:rounded-full
                                      [&>span>span]:h-full
                                      [&>span>span]:bg-gradient-to-r [&>span>span]:from-cyan-400 [&>span>span]:to-fuchsia-500
                                      [&>span>span]:rounded-full
                                      [&>button]:h-3.5 [&>button]:w-3.5
                                      [&>button]:bg-white [&>button]:shadow
                                      [&>button]:border [&>button]:border-zinc-300
                                      [&>button]:focus-visible:outline-none"
                                  />
                                </div>
                              </label>
                              {/* hidden audio element for BGM playback */}
                            </div>
                            <div className="mt-3 flex justify-end">
                                <button
                                    className="neon-btn px-3 py-1.5 rounded-md text-xs font-semibold mt-6"
                                    onClick={() => setOpen(false)}
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header >
        </>
  )
}   