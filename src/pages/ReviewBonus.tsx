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
        <section id="compare-summary" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">C/TS/JS比較まとめ</h2>
          <table className="mb-4 text-sm border border-zinc-700">
            <thead>
              <tr><th className="px-2 py-1 border border-zinc-700">C言語</th><th className="px-2 py-1 border border-zinc-700">TypeScript/JS</th></tr>
            </thead>
            <tbody>
              <tr><td className="px-2 py-1 border border-zinc-700">構造体 struct</td><td className="px-2 py-1 border border-zinc-700">interface/type/typedef</td></tr>
              <tr><td className="px-2 py-1 border border-zinc-700">配列操作</td><td className="px-2 py-1 border border-zinc-700">Array, push, map, filter</td></tr>
              <tr><td className="px-2 py-1 border border-zinc-700">入出力 printf/scanf</td><td className="px-2 py-1 border border-zinc-700">UI, alert, prompt, useState</td></tr>
              <tr><td className="px-2 py-1 border border-zinc-700">mainループ</td><td className="px-2 py-1 border border-zinc-700">状態管理, useEffect, 条件分岐</td></tr>
              <tr><td className="px-2 py-1 border border-zinc-700">乱数 rand()</td><td className="px-2 py-1 border border-zinc-700">Math.random()</td></tr>
              <tr><td className="px-2 py-1 border border-zinc-700">関数プロトタイプ宣言</td><td className="px-2 py-1 border border-zinc-700">型定義/不要</td></tr>
            </tbody>
          </table>
          <div className="mt-4 text-zinc-200 text-sm leading-7">
            <p>ブラックジャックのロジックはC/TS/JSでほぼ同じですが、<b>入出力・型・状態管理</b>の部分が大きく異なります。</p>
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
