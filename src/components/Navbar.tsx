// src/components/Navbar.tsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu"
import { Link, NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import BGMSettingsModal from "@/components/BGMSettingsModal"
import BGMController from "@/components/BGMController"

const inline = true; // Define inline as needed (true or false)

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [bgmEnabled, setBgmEnabled] = useState(true);
    // BGMController 側は `/sounds/${bgmFile}` を付ける実装なのでファイル名のみを保持
    const [bgmFile, setBgmFile] = useState("port.mp3");
    const [bgmVolume, setBgmVolume] = useState(60);
    const [side, setSide] = useState<"left" | "right">("left");
    const anchorRef = useRef<HTMLButtonElement>(null);
    const { pathname } = useLocation()

    // ルート遷移時は自動的に閉じる
    useEffect(() => setOpen(false), [pathname])

  // Esc だけで閉じる（外側クリックはモーダル側で処理）
    useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
        return () => {
      document.removeEventListener("keydown", onKey)
        }
    }, [])

    useLayoutEffect(() => {
        if (!open) return;
        const calc = () => {
            const el = anchorRef?.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const spaceRight = window.innerWidth - rect.left;
            setSide(spaceRight < 380 ? "right" : "left");
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, [open, anchorRef]);

    return (
        <>
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

                {/*右：BGMボタン＋モーダル（relativeでabsolute配置）*/}
                <div className="relative overflow-visible flex items-center gap-4 pr-2">
                    {/* BGMControllerはBGM再生のみ。BGMボタンはBGMSettingsModalのトリガー専用に */}
                    <BGMController
                        bgmEnabled={bgmEnabled}
                        bgmFile={bgmFile}
                        bgmVolume={bgmVolume}
                    />
                    {/* BGMボタン（BGMSettingsModalのトリガー） */}
                    <button
                        ref={anchorRef}
                        id="bgm-anchor"
                        className="neon-btn text-xs tracking-wider font-mono text-cyan-300 px-2 py-1 rounded-md
                     hover:text-cyan-100 transition focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                        onClick={() => setOpen(v => !v)}
                    >
                        BGM
                    </button>
                    {/* BGMSettingsModal（モーダル本体） */}
                    <BGMSettingsModal
                        inline={false}
                        open={open}
                        bgmEnabled={bgmEnabled}
                        setBgmEnabled={setBgmEnabled}
                        bgmFile={bgmFile}
                        setBgmFile={setBgmFile}
                        bgmVolume={bgmVolume}
                        setBgmVolume={setBgmVolume}
                        onClose={() => setOpen(false)}
                    />
                </div>
            </div>
        </header >
      {/* ...existing code... */}
        {/* If you need to use pos, calculate it here */}
        {/*
          Example usage for pos:
          const pos = inline
            ? side === "left"
                ? "absolute left-0 top-[calc(100%+8px)]"
                : "absolute right-0 top-[calc(100%+8px)]"
            : "fixed top-16 right-4";
        */}
        </>
  )
}