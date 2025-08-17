// src/components/Navbar.tsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu"
import { Link, NavLink } from "react-router-dom"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function Navbar() {
  const [showSlider, setShowSlider] = useState(false)

  return (
    <>
      <header className="
        sticky top-0 z-50
        bg-black/70 backdrop-blur-md
        border-b border-zinc-800/70
      ">
        {/* 安全な左右余白 & 最大幅 */}
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          {/* 1 行で左右に配置 */}
          <div className="h-14 flex items-center justify-between">
            {/* 左：ブランド + メニュー */}
            <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
              <Link
                to="/"
                className="
                  font-[Stalinist_One] tracking-[0.2em]
                  text-sm sm:text-base text-zinc-200 hover:text-white
                  [text-shadow:0_0_18px_rgba(56,189,248,.35)]
                "
                style={{ fontFamily: '"Stalinist One", sans-serif' }}
              >
                BLACKJACKWD
              </Link>

              {/* メニューの間隔はここ（gap） */}
              <NavigationMenu>
                <NavigationMenuList className="flex items-center gap-5 md:gap-8">
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
                            isActive
                              ? "text-white bg-zinc-900/60 ring-1 ring-zinc-700/60"
                              : ""
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
            <div className="flex items-center gap-4 pr-2">
              <div className="relative flex items-center gap-2">
                {showSlider && (
                  <div
                    className="absolute right-full top-full mt-2 mr-4 p-4 rounded-xl bg-zinc-900/95 ring-2 ring-cyan-400/40 shadow-2xl flex flex-col items-center"
                    style={{ minWidth: '220px', maxWidth: '90vw' }}
                  >
                    <div className="mb-2 text-cyan-300 font-bold text-xs tracking-wide">BGM Volume</div>
                    <Slider
                      defaultValue={[60]}
                      max={100}
                      step={1}
                      className="w-40 [&>span[data-orientation=horizontal]]:h-2 [&>span[data-orientation=horizontal]]:w-full [&>span[data-orientation=horizontal]]:bg-gradient-to-r [&>span[data-orientation=horizontal]]:from-cyan-400 [&>span[data-orientation=horizontal]]:to-fuchsia-500 [&>span[data-orientation=horizontal]]:rounded-full [&>span>span]:h-full [&>span>span]:bg-transparent [&>span>span]:rounded-full [&>button]:h-4 [&>button]:w-4 [&>button]:bg-cyan-300 [&>button]:shadow [&>button]:border-2 [&>button]:border-cyan-400"
                    />
                    <button
                      className="mt-3 px-3 py-1 rounded bg-cyan-400 text-zinc-900 font-bold text-xs hover:bg-cyan-300 transition"
                      onClick={() => setShowSlider(false)}
                    >閉じる</button>
                  </div>
                )}
                <span
                  className="text-xs tracking-wider text-cyan-300 select-none font-mono cursor-pointer hover:text-cyan-400 transition"
                  onClick={() => setShowSlider(v => !v)}
                >
                  BGM
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
