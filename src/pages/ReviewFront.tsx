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
              <CodeBlock lang="c" code={cHeaderCode} />
              <div className="mt-4 text-zinc-200 text-sm leading-7">
                <p>標準入出力・乱数・時間関数のヘッダを読み込むことで、ブラックジャックの基本機能を使えるようにしています。</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>
        <section id="card-struct" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">カード構造体</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={cardStructC} />
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
