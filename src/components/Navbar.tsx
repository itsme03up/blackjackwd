// src/components/Navbar.tsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu"
import { Link, NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import BGMController from "@/components/BGMController"

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const popRef = useRef<HTMLDivElement>(null)
    const { pathname } = useLocation()

    // ルート遷移時は自動的に閉じる
    useEffect(() => setOpen(false), [pathname])

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

                {/*右：BGMコントローラー*/}
                <div className="flex md:gap-4">
                    <BGMController />
                </div>
            </div>
        </header >
        </>
  )
}