// src/components/CardSvg.tsx
import { memo, type FC } from "react";

type Props = { code: string; suit: "♥" | "♦" | "♣" | "♠"; back?: boolean };

// 背面は public/images/card.png
const backImg = "/images/card.png";

// 1) まとめ取り（?component 付いてても付いてなくてもOK）
const rawModules = import.meta.glob('/src/assets/cards/*.svg', { eager: true });
const rawModulesComponent = import.meta.glob('/src/assets/cards/*.svg?component', { eager: true });

// 2) ファイル名（拡張子なし）→ モジュール で引けるようマップ化
type AnyMod = any;
const map: Record<string, AnyMod> = {};
for (const [path, mod] of Object.entries({ ...rawModules, ...rawModulesComponent })) {
  const file = path.split("/").pop()!;         // "ace_of_spades.svg?component" も来る
  const base = file.replace(/\.svg(\?component)?$/, ""); // → "ace_of_spades"
  map[base] = mod;
}
// if (import.meta.env.DEV) {
//   console.log('cards loaded:', Object.keys(map).slice(0, 8))
// }

export const CardSvg: FC<Props> = memo(({ code, suit, back }) => {
  const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      className="
        w-[var(--card-w)] h-[var(--card-h)]
        max-w-[var(--card-w)] max-h-[var(--card-h)]
        shrink-0 grow-0 basis-auto
        overflow-hidden rounded-md
        border border-zinc-700 bg-zinc-900
        grid place-items-center
      "
    >
      {children}
    </div>
  );

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
    );
  }

  // 3) ファイル名ベースで取得（例: "ace_of_spades"）
  const mod = map[code];

  if (!mod) {
    // 見つからないときはファイル一覧を確認したい時用：必要なら console.log(Object.keys(map))
    return (
      <Wrapper>
        <span className="text-[10px] text-zinc-400">{code}</span>
      </Wrapper>
    );
  }

  // 4) 取りうるパターンを吸収
  //   a) Reactコンポーネントが default に入っている
  //   b) 文字列URL（<img src> 用）
  //   c) そのまま関数（コンポーネント）として返る
  const CompOrUrl = (mod as any).default ?? mod;

  const color = suit === "♥" || suit === "♦" ? "text-rose-400" : "text-zinc-100";

  if (typeof CompOrUrl === "string") {
    // URLだった場合
    return (
      <Wrapper>
        <img src={CompOrUrl} alt={code} className="!w-full !h-full object-contain" />
      </Wrapper>
    );
  }

  // Reactコンポーネントとして描画
  const Svg: React.FC<React.SVGProps<SVGSVGElement>> = CompOrUrl;
  return (
    <Wrapper>
      <Svg className={`!w-[90%] !h-[90%] ${color} drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]`} />
    </Wrapper>
  );
});
