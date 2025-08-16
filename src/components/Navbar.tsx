import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

// モバイル判定フック（簡易版）
function useIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function NavbarMobile() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full flex flex-col items-center justify-between border-b border-zinc-800 bg-zinc-900 z-50 m-0 p-0">
      <span className="text-xl font-extrabold tracking-wide text-black mt-2 mb-2">BlackJacKWD</span>
      <NavigationMenu>
        <NavigationMenuList className="flex flex-col gap-2">
          <NavigationMenuItem>
            <Button variant="ghost" asChild className="text-black">
              <Link to="/game">ゲーム画面</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" asChild className="text-black">
              <Link to="/review">コードレビュー</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" asChild className="text-black">
              <Link to="/pages/kaihatsunikki.md">開発日記</Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-4 mt-2 mb-2">
        <Switch />
        <span className="text-sm text-black">BGM</span>
        <span className="text-sm text-black">音量</span>
        <Slider min={0} max={100} step={1} value={[50]} className="w-24" />
      </div>
    </nav>
  );
}

export default function Navbar() {
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [volume, setVolume] = useState([50]);
  const isMobile = useIsMobile();

  if (isMobile) {
    return <NavbarMobile />;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 w-full flex items-center justify-between border-b border-zinc-800 bg-zinc-900 z-50 m-0 p-0">
      {/* 左：ロゴ＋ナビリンク */}
      <div className="flex items-center gap-6">
  <h1 className="m-0 text-2xl font-extrabold tracking-wide text-black">BlackJacKWD</h1>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" asChild className="text-black">
                <Link to="/game">ゲーム画面</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" asChild className="text-black">
                <Link to="/review">コードレビュー</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button variant="ghost" asChild className="text-black">
                <Link to="/pages/kaihatsunikki.md">開発日記</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* 右：設定 */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={bgmEnabled} onCheckedChange={setBgmEnabled} />
          <span className="text-sm text-black">BGM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-black">音量</span>
          <Slider min={0} max={100} step={1} value={volume} onValueChange={setVolume} className="w-32" />
        </div>
      </div>
    </nav>
  );
}
