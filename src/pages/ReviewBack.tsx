// このファイルは削除されました
// REMOVE ME
// REMOVE ME
// REMOVE ME
import { ReviewTOC } from "../components/ReviewTOC";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { CodeBlock } from "../components/CodeBlock";
import Layout from "../components/layout";
// ...セクション・レイアウト・TOC用items配列を後で追加...
export default function ReviewBack() {
  // TOC用items配列
  const items = [
    { id: "player-turn", label: "プレイヤーターン関数" },
    { id: "dealer-turn", label: "ディーラーターン関数" },
    { id: "game-main", label: "1ゲーム処理" },
    { id: "react-ts-point", label: "React+TS移植ポイント" },
    { id: "demo", label: "体験デモ" },
  ];

  // コード例（必要部分のみ）
  const playerTurnC = `int play_player(Card deck[], int* deck_pos, Card hand[]) { ... }`;
  const playerTurnTS = `function playPlayer(deck: Card[], deckPos: { value: number }, hand: Card[]): number { ... }`;
  const playerTurnJS = `function playPlayer(deck, deckPos, hand) { ... }`;
  const dealerTurnC = `int play_dealer(Card deck[], int* deck_pos, Card hand[]) { ... }`;
  const dealerTurnTS = `function playDealer(deck: Card[], deckPos: { value: number }, hand: Card[]): number { ... }`;
  const dealerTurnJS = `function playDealer(deck, deckPos, hand) { ... }`;
  const gameMainC = `int play_game(int money) { ... }`;
  const gameMainTS = `function playGame(money: number): number { ... }`;
  const gameMainJS = `function playGame(money) { ... }`;

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
        <section id="player-turn" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">プレイヤーターン関数</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={playerTurnC} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={playerTurnTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={playerTurnJS} />
            </TabsContent>
          </Tabs>
        </section>
        <section id="dealer-turn" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">ディーラーターン関数</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={dealerTurnC} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={dealerTurnTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={dealerTurnJS} />
            </TabsContent>
          </Tabs>
        </section>
        <section id="game-main" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1ゲーム処理</h2>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={gameMainC} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={gameMainTS} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={gameMainJS} />
            </TabsContent>
          </Tabs>
        </section>
        <section id="react-ts-point" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">React+TS移植ポイント</h2>
          <div className="mt-4 text-zinc-200 text-sm leading-7">
            <ul className="list-disc pl-6 mb-4">
              <li>構造体 → interface</li>
              <li>配列操作はそのまま書き換えOK</li>
              <li>入出力は全部UIに変える</li>
              <li>ループは「状態更新」で表現する</li>
            </ul>
          </div>
        </section>
        <section id="demo" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">体験デモ</h2>
          <div className="mt-4 text-zinc-200 text-sm leading-7">
            <p>（ここにプレイヤーターン体験デモUIを追加できます）</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
