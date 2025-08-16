import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  return (
    <nav className="w-full bg-zinc-900 text-zinc-100 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold tracking-wide">BlackJacKWD</span>
        <Link to="/game" className="hover:underline text-sm">ゲーム画面</Link>
        <Link to="/review" className="hover:underline text-sm">コードレビュー</Link>
        <Link to="/pages/kaihatsunikki.md" className="hover:underline text-sm">開発日記</Link>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bgmEnabled}
            onChange={e => setBgmEnabled(e.target.checked)}
            className="accent-zinc-500"
          />
          BGM
        </label>
        <label className="flex items-center gap-2 text-sm">
          音量
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-24 accent-zinc-500"
          />
        </label>
      </div>
    </nav>
  );
}
