// ブラックジャック解説 前半ページ
import { ReviewTOC } from "../components/ReviewTOC";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Popover } from "../components/ui/popover";
import { CodeBlock } from "../components/CodeBlock";
import Layout from "../components/layout";
// ...セクション・レイアウト・TOC用items配列を後で追加...
export default function ReviewFront() {
  // TOC用items配列
  const items = [
    { id: "c-header", label: "C言語のヘッダ部分" },
    { id: "card-struct", label: "カード構造体" },
    { id: "hand-value", label: "手札合計値関数" },
    { id: "show-hand", label: "カード・手札表示関数" },
    { id: "deck-create", label: "52枚デッキ作成" },
    { id: "deck-shuffle", label: "デッキシャッフル" },
  ];

  // コード例（必要部分のみ）
  const cHeaderCode = `#include <stdio.h>\n#include <stdlib.h>\n#include <time.h>`;
  const cardStructC = `typedef struct {\n  char* suit;\n  char* rank;\n  int value;\n} Card;`;
  const cardStructTS = `type Card = { suit: string; rank: string; value: number }`;
  const cardStructJS = `/** @typedef {{suit:string,rank:string,value:number}} Card */`;
  const handValueC = `int hand_value(Card hand[], int count) { ... }`;
  const handValueTS = `function handValue(hand: Card[]): number { ... }`;
  const handValueJS = `function handValue(hand) { ... }`;
  const showHandC = `void print_card(Card c) { ... }\nvoid show_hand(Card hand[], int count, const char* name) { ... }`;
  const showHandTS = `function printCard(card: Card): string { ... }\nfunction showHand(hand: Card[], name: string): string { ... }`;
  const showHandJS = `function printCard(card) { ... }\nfunction showHand(hand, name) { ... }`;
  const deckCreateC = `void create_deck(Card deck[]) { ... }`;
  const deckCreateTS = `function createDeck(): Card[] { ... }`;
  const deckCreateJS = `function createDeck() { ... }`;
  const deckShuffleC = `void shuffle_deck(Card deck[]) { ... }`;
  const deckShuffleTS = `function shuffleDeck(deck: Card[]): void { ... }`;
  const deckShuffleJS = `function shuffleDeck(deck) { ... }`;

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
        <section id="c-header" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">C言語のヘッダ部分</h2>
          <Tabs defaultValue="c-header" className="w-full mb-4">
            <TabsList className="flex w-full">
              <TabsTrigger value="c-header">C</TabsTrigger>
            </TabsList>
            <TabsContent value="c-header" className="mt-4">
              <CodeBlock lang="c" code={`#include <stdio.h>   // 入出力関数（printf, scanfなど）を使うためのヘッダ\n#include <stdlib.h>  // 標準ライブラリ（rand, srand, mallocなど）を使うためのヘッダ\n#include <time.h>    // 時間関数（time）を使うためのヘッダ（乱数の種に利用）`} />
              <div className="mt-4 text-zinc-200 text-sm leading-7">
                <p>ここでやっていること</p>
                <p><b>#include &lt;stdio.h&gt;</b><br />
                  → <span>printf, scanf</span> など標準的な入出力を扱うために必要なヘッダです。<br />
                  → 例えば「カードを表示する」ときや「入力を受け付ける」ときに使います。</p>
                <p><b>#include &lt;stdlib.h&gt;</b><br />
                  → <Popover content={<div><b>rand()</b><br />乱数を返す関数。<br />使い方: <code>int r = rand();</code></div>} side="top">
                      <span className="underline cursor-pointer text-blue-300">rand()</span>
                    </Popover> や <Popover content={<div><b>srand()</b><br />乱数の種を設定する関数。<br />使い方: <code>srand(time(NULL));</code></div>} side="top">
                      <span className="underline cursor-pointer text-blue-300">srand()</span>
                    </Popover> を使うためのヘッダです。<br />
                  → ブラックジャックではカードをシャッフルするときに乱数を使うので必須です。<br />
                  → 他にもメモリ確保 (malloc) などの関数も含まれていますが、今回は主に乱数用途。</p>
                <p><b>#include &lt;time.h&gt;</b><br />
                  → <Popover content={<div><b>time(NULL)</b><br />現在の時刻（UNIX時間）を取得。<br />使い方: <code>time_t t = time(NULL);</code></div>} side="top">
                      <span className="underline cursor-pointer text-blue-300">time(NULL)</span>
                    </Popover> で現在の時間を取得するためのヘッダです。<br />
                  → これを <Popover content={<div><b>srand()</b><br />乱数の種を設定する関数。<br />使い方: <code>srand(time(NULL));</code></div>} side="top">
                      <span className="underline cursor-pointer text-blue-300">srand()</span>
                    </Popover> に渡すことで「毎回違うシャッフル結果」にします。<br />
                  → もしこれをしなかったら、プログラムを実行するたびに同じカード順番になってしまいます。</p>
                <p>ここまでで、ゲームを動かす準備として「入出力・乱数・時間」のライブラリを読み込んでいる、ということですね。</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>
        <section id="card-struct" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">カード１枚の情報をまとめた構造体</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={cardStructC} />
              <div className="mt-4 text-zinc-200 text-sm leading-7">
                <p><b>構造体って何？</b><br />
                  C言語の <Popover content={<div><b>構造体 (struct)</b><br />複数の異なる型のデータをひとまとめにできる仕組み。<br />例：<br /><pre style={{ margin: 0 }}>{`struct Person {\n  char* name;\n  int age;\n};`}</pre></div>} side="top"><span className="underline cursor-pointer text-blue-300">構造体 (struct)</span></Popover> は、複数の異なる型のデータをひとまとめにできる仕組みです。<br />
                  ブラックジャックでは「カード1枚」に対して「マーク」「数字」「点数」が必要なので、それをひとまとめにしています。</p>
                <p><b>各メンバの意味</b></p>
                <p><b>char* suit;</b><br />
                  → 「マーク（スート）」を表します。<br />
                  "H"（ハート）、"D"（ダイヤ）、"C"（クラブ）、"S"（スペード）のどれかを文字列として持ちます。<br />
                  例: "H" なら ♥。</p>
                <p><b>char* rank;</b><br />
                  → 「数字や絵札（ランク）」を表します。<br />
                  "A", "2", "3", …, "10", "J", "Q", "K" の文字列。<br />
                  例: "A"ならエース。</p>
                <p><b>int value;</b><br />
                  → ブラックジャックで使う「点数」を保持します。<br />
                  <ul className="list-disc pl-6">
                    <li>A（エース）は 11点（後で必要に応じて1点に変換するロジックあり）</li>
                    <li>2〜10 は数字通りの点数</li>
                    <li>J, Q, K は 10点</li>
                  </ul>
                </p>
                <p><b>typedef struct ... Card;</b><br />
                  最後の <b>Card;</b> がポイントです。<br />
                  通常は <code>struct Card</code> と書かなければならないのですが、<b>typedef</b> を使って別名を付けているので、以降は単に <b>Card</b> と書くだけでOKになります。</p>
                <p>例：</p>
                <CodeBlock lang="c" code={`Card c;  // struct Card c; と同じ意味`} />
                <p>つまりこの定義のおかげで「カード1枚」を扱うときに、<br />
                  Card 型の変数を用意すれば「マーク・ランク・点数」をまとめて持てるようになっています。</p>
                <p>👉 このあと登場する hand_value 関数で、Card の配列を受け取って「手札の合計点」を計算できるようになっているんです。</p>
              </div>
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={cardStructTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={cardStructJS} />
            </TabsContent>
          </Tabs>
        </section>
        <section id="hand-value" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">手札合計値関数</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={handValueC} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={handValueTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={handValueJS} />
            </TabsContent>
          </Tabs>
        </section>
        <section id="show-hand" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">カード・手札表示関数</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={showHandC} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={showHandTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={showHandJS} />
            </TabsContent>
          </Tabs>
        </section>
        <section id="deck-create" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">52枚デッキ作成</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={deckCreateC} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={deckCreateTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={deckCreateJS} />
            </TabsContent>
          </Tabs>
        </section>
        <section id="deck-shuffle" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">デッキシャッフル</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={deckShuffleC} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={deckShuffleTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={deckShuffleJS} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Layout>
  );
}
