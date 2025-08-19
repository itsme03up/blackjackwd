// src/components/CardSvg.tsx
import { memo, type FC } from "react";

type Props = { code: string; suit: "♥" | "♦" | "♣" | "♠"; back?: boolean };

// 背面は public/images/card.png
const backImg = "/images/card.png";

// 1) まとめ取り（?component 付いてても付いてなくてもOK）
const rawModules = import.meta.glob('/src/assets/cards/*.svg', { eager: true });
const rawModulesComponent = import.meta.glob('/src/assets/cards/*.svg?component', { eager: true });

// 2) ファイル名（拡張子なし）→ モジュール で引けるようマップ化
type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;
type CardModule = SvgComponent | { default: SvgComponent } | string;
const map: Record<string, CardModule> = {};
for (const [path, mod] of Object.entries({ ...rawModules, ...rawModulesComponent })) {
  const file = path.split("/").pop()!;         // "ace_of_spades.svg?component" も来る
  const base = file.replace(/\.svg(\?component)?$/, ""); // → "ace_of_spades"
  map[base] = mod as CardModule;
}
// if (import.meta.env.DEV) {
//   console.log('cards loaded:', Object.keys(map).slice(0, 8))
// }

export const CardSvg: FC<Props> = memo(({ code, suit, back }) => {
  // 二重枠ラッパー
  const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      className="w-[var(--card-w)] h-[var(--card-h)] aspect-[5/7] max-w-[var(--card-w)] max-h-[var(--card-h)] shrink-0 grow-0 basis-auto overflow-hidden rounded-[12px] ring-1 ring-zinc-700/70 bg-zinc-900 drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)"
      style={{ willChange: 'transform', margin: '0.25rem' }}>
      <div className="w-full h-full bg-white grid place-items-center rounded-[8px] aspect-[5/7]">
        <div className="w-full h-full bg-transparent flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );

  if (back) {
    return (
      <Wrapper>
        <img
          src={backImg}
          alt="card back"
          className="w-full h-full object-contain select-none rounded-[8px] aspect-[5/7]"
          draggable={false}
          style={{ imageRendering: 'auto', backfaceVisibility: 'hidden' }}
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
  const CompOrUrl = (typeof mod === 'object' && 'default' in mod) ? mod.default : mod;

  const color = suit === "♥" || suit === "♦" ? "text-rose-400" : "text-zinc-100";

  // SVGのviewBoxから縦横比を取得する関数
  function getAspectFromViewBox(viewBox?: string): string {
    if (!viewBox) return "aspect-[5/7]";
    const parts = viewBox.split(" ").map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      const w = parts[2], h = parts[3];
      // 端数を丸めてaspect-[w/h]形式に
      return `aspect-[${Math.round(w)}/${Math.round(h)}]`;
    }
    return "aspect-[5/7]";
  }

  if (typeof CompOrUrl === "string") {
    // URLだった場合
    return (
      <Wrapper>
        <img
          src={CompOrUrl}
          alt={code}
          className={`w-full h-full object-contain rounded-[8px] ${"aspect-[5/7]"}`}
          style={{ imageRendering: 'auto', backfaceVisibility: 'hidden' }}
        />
      </Wrapper>
    );
  }

  // Reactコンポーネントとして描画
  const Svg: React.FC<React.SVGProps<SVGSVGElement>> = CompOrUrl;
  // viewBox取得とデバッグ
  let viewBox: string | undefined = undefined;
  if (
    'type' in Svg &&
    Svg.type !== null &&
    typeof Svg.type === 'object' &&
    'viewBox' in Svg.type
  ) {
    viewBox = (Svg.type as { viewBox?: string }).viewBox;
  } else if ('viewBox' in Svg) {
    viewBox = (Svg as { viewBox?: string }).viewBox;
  }
  if (
    !viewBox &&
    'props' in Svg &&
    Svg.props !== null &&
    typeof Svg.props === 'object' &&
    'viewBox' in Svg.props
  ) {
    viewBox = (Svg.props as { viewBox?: string }).viewBox;
  }
  console.log('CardSvg viewBox:', viewBox, 'code:', code);
  const aspectClass = getAspectFromViewBox(viewBox);
  return (
    <Wrapper>
      <Svg
        className={`w-full h-full ${color} drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] rounded-[8px] ${aspectClass}`}
        shapeRendering="geometricPrecision"
        preserveAspectRatio="xMidYMid meet"
      />
    </Wrapper>
  );
});
