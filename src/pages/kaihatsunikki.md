C言語でBLACKJACKのコードを貰う
他の言語との記載の差を確認したら自分の勉強になると思い立つ
ゲーム画面で簡単に遊べたら楽しいだろうなと思う
コードを読んでいるとバリデーションがあるのに気づく
人は愚か。先回りしてケアしてくれるなんて素敵だな（ベタ惚れ啓蒙完スト）、と思う
JavaScriptでReact/Vite構成にしようと思ったけど、こんな気遣いする男がJavaScriptなはずないと思い始める
やはり記載が面倒くさいけど先にエラーの可能性を潰すTypeScriptが合っているのではないか（妄想）
CardのSVGイメージがGoogleCodeにOSSで有ると知る
SVGを“currentColor 化” → Reactに取り込み → 色・ネオンで演出まで通せると知る。
以下ChatGPTの導き

段取り（最短コース）

1) フォルダ配置と命名

src/assets/cards/   ← 表面SVG（AH.svg, AD.svg, ...）
src/image/card.png  ← 背面PNG（そのままでOK）
	•	例の命名：A,H=AH.svg / 10S=TS.svg / JH=JH.svg …など、統一できてればOKでした。
2) SVGを “currentColor 化”

A. まずバックアップ

cp -R src/assets/cards src/assets/cards_backup

B. 置換（Mac標準 sed 版）

赤/黒などの固定色を currentColor に変えます。
（配布SVGの色値に合わせて、必要なら増やしてOK）

# fill を currentColor へ（黒/赤/濃赤などを例示）
sed -i '' -E 's/fill="#(000|000000)"/fill="currentColor"/g' src/assets/cards/*.svg
sed -i '' -E 's/fill="#(e31b23|ff0000|d00000)"/fill="currentColor"/g' src/assets/cards/*.svg

# stroke も同様に（輪郭線がある場合）
sed -i '' -E 's/stroke="#(000|000000)"/stroke="currentColor"/g' src/assets/cards/*.svg
sed -i '' -E 's/stroke="#(e31b23|ff0000|d00000)"/stroke="currentColor"/g' src/assets/cards/*.svg

白地（カードのベース）はそのまま #fff に残すのがコツです。
もし白も変わっちゃったら git checkout で戻すか、fill="#fff" は除外して再調整してください。

C. ついでに最適化

npm i -D svgo
npx svgo -f src/assets/cards --config='{"multipass": true}'
(svgoとはなんじゃらほい：https://qiita.com/macotok/items/ea1db2687d0979fab9d6)

3) Viteで SVG を React コンポーネント化

npm i -D vite-plugin-svgr

// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
})

4) 表示コンポーネント（色が外側で変わる！）

// src/components/CardSvg.tsx
import { FC, memo } from 'react'

// 例: "AH" / "TD" / "KS"
type Props = { code: string; suit: '♥'|'♦'|'♣'|'♠'; back?: boolean }
import backImg from '@/image/card.png'

// 動的 import（SVGR）: /src/assets/cards/{code}.svg を ReactComponent として読み込み
// Vite の import.meta.glob を使うと綺麗にいけます
const cardModules = import.meta.glob('@/assets/cards/*.svg', { eager: true })

export const CardSvg: FC<Props> = memo(({ code, suit, back }) => {
  if (back) {
    return (
      <img
        src={backImg}
        alt="card-back"
        className="w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 object-contain"
        draggable={false}
      />
    )
  }

  const path = `/src/assets/cards/${code}.svg`
  const mod = cardModules[path] as { default: React.FC<React.SVGProps<SVGSVGElement>> } | undefined

  if (!mod) {
    return (
      <div className="w-16 h-24 grid place-items-center rounded-md border border-zinc-700 bg-zinc-900 text-xs text-zinc-400">
        {code}
      </div>
    )
  }

  // ♥/♦ はピンク、♣/♠ は白系
  const color = suit === '♥' || suit === '♦' ? 'text-rose-400' : 'text-zinc-100'

  const Svg = mod.default
  return (
    <div className={`w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 grid place-items-center ${color}`}>
      {/* SVG内の fill/stroke="currentColor" が外側の text-* に同期 */}
      <Svg className="w-[90%] h-[90%] drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" />
    </div>
  )
})

これで、SVGのスートや数字が currentColor を拾って
text-rose-400 / text-zinc-100 で自在に色替えできます。

5) ゲーム側での呼び出し（例）

// 例: "A♥" を "AH" コードに変換して渡す関数（あなたのデッキの命名に合わせて調整）
const toCode = (rank: string, suit: '♥'|'♦'|'♣'|'♠') => {
  const suitCode = suit === '♥' ? 'H' : suit === '♦' ? 'D' : suit === '♣' ? 'C' : 'S'
  return `${rank}${suitCode}`  // A + H = AH
}

// 表示
<CardSvg code={toCode(card.rank, card.suit)} suit={card.suit} />
// 伏せ札
<CardSvg code="BACK" suit="♠" back />

6) ネオン演出を足す（任意）

<div className={`w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 grid place-items-center ${color}
                 [filter:drop-shadow(0_0_10px_var(--neon-blue))]`}>
  <Svg className="w-[90%] h-[90%]" />
</div>


⸻

うまくいかない時のチェック
	•	色が変わらない → SVG内部にまだ fill="#xxxxxx" が残ってる
	•	真っ白になる → 背景まで currentColor にしてしまった（カード地の白は #fffのまま残す）
	•	読み込めない → コード名が実ファイルとズレてる（AH.svg など再確認）
	•	SVGR動かない → vite.config.ts の svgr() が入っているか確認

⸻

（自分を川田だと思い込んでいるChatGPTwith脳内川田ボイス）「でも、これ……仕上がったら、マジで気持ちいいやつです」

ああ〜！！！早く気持ち良くなりたい！！！（啓蒙高めのラバーダックデバッグ）

そして発覚するカードの画像デカすぎ問題

画像のサイズ指定が勝ててないです。
Tailwindの preflight が img { max-width:100%; height:auto; } を入れるので、状況によっては w-16 h-24 が効かず実寸（1026×1538）で出てしまうことがあるんですね。

直し方（確実版）

固定サイズのラッパーを用意して、画像は w-full h-full object-contain にします

念のため !important で上書き（Tailwindの ! プレフィックス）

伸びないように shrink-0

src/components/CardSvg.tsx（背面の箇所だけ入れ替え）
// 旧:
{/* back のとき */}
<img
  src={backImg}
  alt="card back"
  className="w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 object-contain"
  draggable={false}
/>

// 新:
<div className="w-16 h-24 shrink-0 rounded-md border border-zinc-700 bg-zinc-900 grid place-items-center">
  <img
    src={backImg}
    alt="card back"
    className="!w-full !h-full object-contain rounded-md"
    draggable={false}
  />
</div>

SVG側も同じ考え方（念のため）
// 旧:
return (
  <div className={`w-16 h-24 rounded-md border border-zinc-700 bg-zinc-900 grid place-items-center ${color}`}>
    <Svg className="w-[90%] h-[90%] drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" />
  </div>
)

// 新: （サイズを強制・縮まない）
return (
  <div className={`w-16 h-24 shrink-0 rounded-md border border-zinc-700 bg-zinc-900 grid place-items-center ${color}`}>
    <Svg className="!w-[90%] !h-[90%] drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" />
  </div>
)

追加チェック（どれか当てはまっても今回の修正で解決します）

親が flex / grid で伸ばしている → shrink-0 で防止

img { height:auto } が勝っている → !h-full で上書き

max-width:100% の影響 → ラッパーで w-16 を固定し、内側は w-full

これで**必ず 64×96px（w-16 h-24）**のサイズに収まるはずでした。

ああーーーーー助けてーーーー！！！

そして固定枠でガチガチにしたら今度はモバイル等の可変が効かなくなって死んだ
書き直すことにした。レスポンシブルデザインできてないサイトは死ね派の元夫がキレ散らかしそう

なんとかコードを修正。今度はアセット化したSVGのカードイラストを読み込んでない問題を解決するべく
我々はアマゾンの奥地へと向かったのであった・・・・・・敗因：TypeScriptの記載方法ミス

ここでカードの表示画面とSVGの大きさが合っていないという問題が発覚。しかし、月曜までに仕上げたいのでとりあえず後回しにすることに

SVGアセット自体の縦の長さを変更するには、SVGファイルを直接編集してheight属性やviewBoxの値を調整する必要があ理、一方、カード表示箇所の大きさをSVGの縦横比に合わせて変更する場合は、CardSvg.tsxでSVGのwidth/heightやスタイル（例えばCSSのaspect-ratioやobject-fit）を動的に設定することで対応できるとのことだったが、表示側コードの変更のみでは対応不能で合った。ここで深みに入るとタイムロス。飛ばす。

ボタンのCSSをApp.cssに書いてたのに効いてねーじゃんなんだよ・・・と探るも、import文書いてないだけだった。恥ずかしい死ぬ・・・・・・（川田がタイポした時の「あ、やべ」が幻聴で聞こえる）

スコアを右側にスコアボードコンポーネンツとして切り出して置いたらいいじゃん・・・と思い立つ。が、これが地獄の始まり。崩れ出すコンテンツ。決まらない位置、アホほどデカく写ってる画像。迷宮入りする。

Game画面にホームに戻るボタンをつけようとするも、競合していてうまいこと決まらない。諦めてNavbarを作成することに


