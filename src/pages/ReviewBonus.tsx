// ブラックジャック解説 おまけページ
import { ReviewTOC } from "../components/ReviewTOC";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { CodeBlock } from "../components/CodeBlock";
import Layout from "../components/layout";
// ...セクション・レイアウト・TOC用items配列を後で追加...
export default function ReviewBonus() {
  // TOC用items配列
  const items = [
    { id: "compare-summary", label: "C/TS/JS比較まとめ" },
    { id: "tips", label: "移植Tips・注意点" },
    { id: "ux", label: "UX改善・補足" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl p-6 md:px-12 lg:px-24 text-left">
        {/* ページ遷移ボタン */}
        <div className="flex gap-4 mb-6">
          <a href="/review-front" className="px-4 py-2 rounded bg-emerald-700 text-white font-semibold hover:bg-emerald-600">前半</a>
          <a href="/review-back" className="px-4 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-600">後半</a>
          <a href="/review-bonus" className="px-4 py-2 rounded bg-pink-700 text-white font-semibold hover:bg-pink-600">おまけ</a>
        </div>
        <ReviewTOC items={items} />
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">おまけ：C言語版ブラックジャックを React + TypeScript 版 に移植するポイント</h2>
          <div className="mt-4 text-zinc-200 text-sm leading-7">
            <h3 className="text-lg font-semibold mb-2">🎯 全体の対応関係</h3>
            <table className="mb-4 text-sm border border-zinc-700">
              <thead>
                <tr><th className="px-2 py-1 border border-zinc-700">C言語</th><th className="px-2 py-1 border border-zinc-700">React/TS</th></tr>
              </thead>
              <tbody>
                <tr><td className="px-2 py-1 border border-zinc-700">Card 構造体</td><td className="px-2 py-1 border border-zinc-700">interface Card {'{'} suit: string; rank: string; value: number {'}'}</td></tr>
                <tr><td className="px-2 py-1 border border-zinc-700">グローバル関数（create_deck, shuffle_deck など）</td><td className="px-2 py-1 border border-zinc-700">普通の関数として定義、Reactコンポーネントから呼び出す</td></tr>
                <tr><td className="px-2 py-1 border border-zinc-700">printf / scanf</td><td className="px-2 py-1 border border-zinc-700">React の useState + JSXでUI表示、ボタン/フォーム入力で操作</td></tr>
                <tr><td className="px-2 py-1 border border-zinc-700">main ループ</td><td className="px-2 py-1 border border-zinc-700">Reactの状態管理（所持金が0になるまで繰り返し）</td></tr>
              </tbody>
            </table>
            <h3 className="text-lg font-semibold mb-2">🃏 Step 1. 型の定義</h3>
            <CodeBlock lang="ts" code={`interface Card {\n  suit: string; // \"H\", \"D\", \"C\", \"S\"\n  rank: string; // \"A\"〜\"K\"\n  value: number; // 1〜11\n}`} />
            <h3 className="text-lg font-semibold mb-2">🃏 Step 2. デッキの生成</h3>
            <CodeBlock lang="ts" code={`function createDeck(): Card[] {\n  const suits = [\"H\", \"D\", \"C\", \"S\"];\n  const ranks = [\"A\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"J\",\"Q\",\"K\"];\n  const values = [11, 2,3,4,5,6,7,8,9,10,10,10,10];\n  const deck: Card[] = [];\n  for (const suit of suits) {\n    for (let r = 0; r < ranks.length; r++) {\n      deck.push({ suit, rank: ranks[r], value: values[r] });\n    }\n  }\n  return deck;\n}`} />
            <h3 className="text-lg font-semibold mb-2">🃏 Step 3. シャッフル</h3>
            <CodeBlock lang="ts" code={`function shuffleDeck(deck: Card[]): Card[] {\n  const shuffled = [...deck];\n  for (let i = shuffled.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];\n  }\n  return shuffled;\n}`} />
            <h3 className="text-lg font-semibold mb-2">🃏 Step 4. 手札の合計計算</h3>
            <CodeBlock lang="ts" code={`function handValue(hand: Card[]): number {\n  let total = 0;\n  let aces = 0;\n  for (const card of hand) {\n    total += card.value;\n    if (card.value === 11) aces++;\n  }\n  while (total > 21 && aces > 0) {\n    total -= 10;\n    aces--;\n  }\n  return total;\n}`} />
            <h3 className="text-lg font-semibold mb-2">🃏 Step 5. UI（プレイヤーターン & ディーラーターン）</h3>
            <CodeBlock lang="tsx" code={`<button onClick={handleHit}>ヒット</button>\n<button onClick={handleStand}>スタンド</button>`} />
            <ul className="list-disc pl-6 mb-4">
              <li>handleHit でカードを1枚引いて状態更新</li>
              <li>handleStand でディーラーのターンに進む</li>
            </ul>
            <h3 className="text-lg font-semibold mb-2">🃏 Step 6. ゲーム進行（所持金・勝敗）</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>money → useStateで保持</li>
              <li>bet → 入力フォームで受け取る</li>
              <li>playerHand, dealerHand, deck, deckPos もuseState</li>
              <li>勝敗判定したら money を増減してUIに表示</li>
            </ul>
            <h3 className="text-lg font-semibold mb-2">🃏 Step 7. メインループ</h3>
            <CodeBlock lang="tsx" code={`{money > 0 ? (\n  <Game money={money} setMoney={setMoney} />\n) : (\n  <p>所持金がなくなりました。ゲーム終了です。</p>\n)}`} />
            <h3 className="text-lg font-semibold mb-2">✅ まとめ</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>構造体 → interface</li>
              <li>配列操作はそのまま書き換えOK</li>
              <li>入出力は全部UIに変える</li>
              <li>ループは「状態更新」で表現する</li>
            </ul>
          </div>
        </section>
        <section id="tips" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">移植Tips・注意点</h2>
          <ul className="list-disc pl-6 mb-4 text-zinc-200 text-sm leading-7">
            <li>型の違い（C: struct, TS: interface/type, JS: JSDoc型）</li>
            <li>配列の扱い（C: 固定長, TS/JS: 可変長Array）</li>
            <li>入出力（C: printf/scanf, TS/JS: UI/alert/prompt）</li>
            <li>乱数（C: rand(), TS/JS: Math.random()）</li>
            <li>メモリ管理（C: malloc/free, TS/JS: GC自動管理）</li>
            <li>mainループ（C: while, TS/JS: useState+条件分岐）</li>
            <li>エラー処理（C: バッファクリア, TS/JS: try/catch, UIで分岐）</li>
          </ul>
          <div className="mt-4 text-zinc-200 text-sm leading-7">
            <p>移植時は「型・配列・入出力・状態管理」の違いに注意しましょう。<br />特にUI化する場合は、<b>useState</b>や<b>イベントハンドラ</b>で状態を管理するのがポイントです。</p>
          </div>
        </section>
        <section id="ux" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">UX改善・補足</h2>
          <ul className="list-disc pl-6 mb-4 text-zinc-200 text-sm leading-7">
            <li>CodeTabsで主要コード例を統一表示</li>
            <li>Popoverで用語解説を追加</li>
            <li>色味強調（Tabs, Trigger, セクション見出し）</li>
            <li>体験デモUI（ボタン・状態表示）</li>
            <li>コピーアイコン・コードブロックの式誤認防止</li>
            <li>目次（TOC）でセクションジャンプ</li>
          </ul>
          <div className="mt-4 text-zinc-200 text-sm leading-7">
            <p>UXを高める工夫として、<b>色味・目次・体験デモ・用語解説・コピー機能</b>などを積極的に導入しましょう。</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
