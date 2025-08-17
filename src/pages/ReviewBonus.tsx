// このファイルは削除されました
// REMOVE ME
// REMOVE ME
import { ReviewTOC } from "../components/ReviewTOC";
import { CodeBlock } from "../components/CodeBlock";
import Layout from "../components/layout";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
// ...セクション・レイアウト・TOC用items配列を後で追加...
export default function ReviewBonus() {
    // TOC用items配列
    const items = [
        { id: "compare-summary", label: "C/TS/JS比較まとめ" },
        { id: "tips", label: "移植Tips・注意点" },
        { id: "ux", label: "UX改善・補足" },
    ];
    const cCode = `#include <stdio.h>   // 入出力関数（printf, scanfなど）を使うためのヘッダ\n#include <stdlib.h>  // 標準ライブラリ（rand, srand, mallocなど）を使うためのヘッダ\n#include <time.h>    // 時間関数（time）を使うためのヘッダ（乱数の種に利用）\n\n// カード1枚の情報をまとめた構造体\ntypedef struct {\n    char* suit;   // カードのマーク（H, D, C, S）\n    char* rank;   // カードの数字や絵札（A, 2, 3, ..., K）\n    int value;    // ブラックジャックでの点数（A=11, J/Q/K=10 など）\n} Card;\n\n// 手札の合計値を計算する関数のプロトタイプ宣言\nint hand_value(Card hand[], int count);\n\n// -----------------------------------------------\n// 手札の合計値を計算する関数\n// A(エース)は11または1として扱い、21を超えないように調整\n// -----------------------------------------------\nint hand_value(Card hand[], int count) {\n    int total = 0;   // 合計点\n    int aces = 0;    // エースの枚数カウント\n\n    // まず全カードを加算し、エースの数も数える\n    for (int i = 0; i < count; i++) {\n        total += hand[i].value;        // カードの点数を足す\n        if (hand[i].value == 11) aces++; // エースならカウント\n    }\n\n    // 合計が21を超える場合、エースを1点として扱って調整\n    while (total > 21 && aces > 0) {\n        total -= 10; // 11点のエースを1点に変更（差分は10点減らす）\n        aces--;      // エースの調整回数を減らす\n    }\n\n    return total; // 調整後の合計を返す\n}\n\n// -----------------------------------------------\n// 1枚のカードを表示する関数\n// -----------------------------------------------\nvoid print_card(Card c) {\n    printf(\"%s%s\", c.suit, c.rank); // 例: \"H10\" や \"DA\"\n}\n\n// -----------------------------------------------\n// 手札全体を表示する関数\n// -----------------------------------------------\nvoid show_hand(Card hand[], int count, const char* name) {\n    printf(\"%sの手札: \", name); // プレイヤー名を表示\n    for (int i = 0; i < count; i++) {\n        print_card(hand[i]);         // カードを表示\n        if (i < count - 1) printf(\" \"); // カード間にスペースを入れる\n    }\n    printf(\" (合計: %d)¥n\", hand_value(hand, count)); // 合計値も表示\n}\n\n// -----------------------------------------------\n// 52枚のカードデッキを作成する関数\n// -----------------------------------------------\nvoid create_deck(Card deck[]) {\n    // カードのマーク（ハート, ダイヤ, クラブ, スペード）\n    char* suits[] = { \"H\", \"D\", \"C\", \"S\" };\n    // カードのランク（A〜K）\n    char* ranks[] = { \"A\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"J\",\"Q\",\"K\" };\n    // ブラックジャックでのカードの点数\n    int values[] = { 11, 2,3,4,5,6,7,8,9,10,10,10,10 };\n\n    int index = 0; // デッキの現在の位置\n    for (int s = 0; s < 4; s++) {      // マークごとのループ\n        for (int r = 0; r < 13; r++) { // ランクごとのループ\n            deck[index].suit = suits[s];  // マーク設定\n            deck[index].rank = ranks[r];  // ランク設定\n            deck[index].value = values[r]; // 値設定\n            index++; // 次のカード位置へ\n        }\n    }\n}\n\n// -----------------------------------------------\n// デッキをシャッフル（ランダムに並べ替える）\n// -----------------------------------------------\nvoid shuffle_deck(Card deck[]) {\n    for (int i = 0; i < 52; i++) {\n        int j = rand() % 52; // 0〜51のランダムな位置を取得\n        // 位置iとjのカードを入れ替える\n        Card temp = deck[i];\n        deck[i] = deck[j];\n        deck[j] = temp;\n    }\n}\n\n// -----------------------------------------------\n// プレイヤーのターンを処理する関数\n// -----------------------------------------------\nint play_player(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2; // 最初の手札枚数は2枚\n    show_hand(hand, count, \"プレイヤー\"); // 初期手札を表示\n\n    // ヒット（カードを引く）かスタンド（引かない）を繰り返す\n    while (1) {\n        int total = hand_value(hand, count);\n        if (total == 21) { // 21なら自動的にスタンド\n            printf(\"21になったので自動的にスタンドします。¥n\");\n            break;\n        }\n        int choice;\n        printf(\"ヒット(1) か スタンド(0)？: \");\n        if (scanf(\"%d\", &choice) != 1) { // 入力エラー\n            printf(\"入力エラーです。スタンドします。¥n\");\n            while (getchar() != '¥n'); // バッファクリア\n            break;\n        }\n        if (choice == 1) { // ヒット\n            hand[count] = deck[(*deck_pos)++]; // デッキからカードを引く\n            printf(\"プレイヤーが引いたカード: \");\n            print_card(hand[count]);\n            count++;\n            printf(\" → 新しい合計: %d¥n\", hand_value(hand, count));\n            if (hand_value(hand, count) > 21) { // バースト判定\n                printf(\"プレイヤーはバースト！¥n\");\n                break;\n            }\n        }\n        else { // スタンド\n            break;\n        }\n    }\n    return hand_value(hand, count); // 最終的な合計値を返す\n}\n\n// -----------------------------------------------\n// ディーラーのターンを処理する関数\n// -----------------------------------------------\nint play_dealer(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2; // 初期手札は2枚\n    show_hand(hand, count, \"ディーラー\"); // ディーラー手札を表示\n\n    // ディーラーは17以上になるまでカードを引く\n    while (hand_value(hand, count) < 17) {\n        hand[count] = deck[(*deck_pos)++];\n        printf(\"ディーラーが引いたカード: \");\n        print_card(hand[count]);\n        count++;\n        printf(\" → 新しい合計: %d¥n\", hand_value(hand, count));\n    }\n    return hand_value(hand, count); // 最終的な合計値を返す\n}\n\n// -----------------------------------------------\n// ブラックジャック1ゲーム分を処理する関数\n// -----------------------------------------------\nint play_game(int money) {\n    int bet;\n    printf(\"現在の所持金: $%d¥n\", money);\n    printf(\"ベット額を入力してください: \");\n    // ベット額の入力とバリデーション\n    if (scanf(\"%d\", &bet) != 1 || bet <= 0 || bet > money) {\n        printf(\"無効なベット額です。最低1ドル、最大で現在の所持金までです。¥n\");\n        while (getchar() != '¥n'); // 入力バッファクリア\n        return money; // 所持金変化なし\n    }\n\n    Card deck[52]; // デッキ配列\n    create_deck(deck);   // デッキ作成\n    shuffle_deck(deck);  // デッキシャッフル\n\n    Card player_hand[12], dealer_hand[12]; // 手札（最大12枚程度）\n    int deck_pos = 0; // デッキの現在位置\n\n    // 最初の配り（プレイヤー2枚、ディーラー2枚）\n    player_hand[0] = deck[deck_pos++];\n    dealer_hand[0] = deck[deck_pos++];\n    player_hand[1] = deck[deck_pos++];\n    dealer_hand[1] = deck[deck_pos++];\n\n    printf(\"=== ブラックジャックへようこそ！ ===¥n\");\n\n    // プレイヤーターン\n    int player_score = play_player(deck, &deck_pos, player_hand);\n    if (player_score > 21) { // バースト\n        printf(\"ディーラーの勝ちです。¥n\");\n        money -= bet; // 負けた分を所持金から引く\n        printf(\"現在の所持金: $%d¥n\", money);\n        return money;\n    }\n\n    // ディーラーターン\n    int dealer_score = play_dealer(deck, &deck_pos, dealer_hand);\n    if (dealer_score > 21) { // ディーラーがバースト\n        printf(\"ディーラーはバースト！ プレイヤーの勝ちです。¥n\");\n        money += bet; // 勝ち分を追加\n        printf(\"現在の所持金: $%d¥n\", money);\n        return money;\n    }\n\n    // 勝敗判定\n    printf(\"プレイヤー: %d, ディーラー: %d¥n\", player_score, dealer_score);\n    if (player_score > dealer_score) { // プレイヤー勝利\n        printf(\"プレイヤーの勝ちです！¥n\");\n        money += bet;\n    }\n    else if (player_score < dealer_score) { // ディーラー勝利\n        printf(\"ディーラーの勝ちです。¥n\");\n        money -= bet;\n    }\n    else { // 引き分け\n        printf(\"引き分け！¥n\");\n        // 所持金変化なし\n    }\n    printf(\"現在の所持金: $%d¥n\", money);\n    return money;\n}\n\n// -----------------------------------------------\n// メイン関数（ゲーム全体のループ管理）\n// -----------------------------------------------\nint main() {\n    srand((unsigned int)time(NULL)); // 乱数の種を設定（毎回違うシャッフルになる）\n    int money = 100; // 初期所持金\n\n    // 所持金が尽きるまでゲームを繰り返す\n    while (money > 0) {\n        money = play_game(money); // 1ゲーム実行\n        if (money <= 0) { // 所持金が0以下で終了\n            printf(\"所持金がなくなりました。ゲーム終了です。¥n\");\n            break;\n        }\n        printf(\"¥n次のゲームを始めます...¥n¥n\");\n    }\n    return 0; // 正常終了\n}\n`;

    // --- ここからコード例変数定義 ---
    // --- ここから主要関数のC/TS/JSコード例タブ表示 ---
    const codeTabsSection = (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">主要関数のC/TS/JSコード例</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">🃏 手札の合計計算 hand_value / handValue</h3>
          <Tabs defaultValue="c" className="mb-4">
            <TabsList>
              <TabsTrigger value="c">C言語</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <div><CodeBlock lang="c" code={handValueCCode} /></div>
              <div><CodeBlock lang="ts" code={handValueTSCode} /></div>
              <div><CodeBlock lang="js" code={handValueJSCode} /></div>
            </div>
          </Tabs>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">🃏 デッキ生成 create_deck / createDeck</h3>
          <Tabs defaultValue="c" className="mb-4">
            <TabsList>
              <TabsTrigger value="c">C言語</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <div><CodeBlock lang="c" code={createDeckCCode} /></div>
              <div><CodeBlock lang="ts" code={createDeckTSCode} /></div>
              <div><CodeBlock lang="js" code={createDeckJSCode} /></div>
            </div>
          </Tabs>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">🃏 シャッフル shuffle_deck / shuffleDeck</h3>
          <Tabs defaultValue="c" className="mb-4">
            <TabsList>
              <TabsTrigger value="c">C言語</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <div><CodeBlock lang="c" code={shuffleDeckCCode} /></div>
              <div><CodeBlock lang="ts" code={shuffleDeckTSCode} /></div>
              <div><CodeBlock lang="js" code={shuffleDeckJSCode} /></div>
            </div>
          </Tabs>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">🃏 手札表示 show_hand / showHand</h3>
          <Tabs defaultValue="c" className="mb-4">
            <TabsList>
              <TabsTrigger value="c">C言語</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <div><CodeBlock lang="c" code={showHandCCode} /></div>
              <div><CodeBlock lang="ts" code={showHandTSCode} /></div>
              <div><CodeBlock lang="js" code={showHandJSCode} /></div>
            </div>
          </Tabs>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">🃏 プレイヤーターン play_player / playPlayerTurn</h3>
          <Tabs defaultValue="c" className="mb-4">
            <TabsList>
              <TabsTrigger value="c">C言語</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <div><CodeBlock lang="c" code={playerTurnCCode} /></div>
              <div><CodeBlock lang="ts" code={playerTurnTSCode} /></div>
              <div><CodeBlock lang="js" code={playerTurnJSCode} /></div>
            </div>
          </Tabs>
        </div>
      </section>
    );

    return (
        <><Layout>
            <div className="mx-auto max-w-5xl p-6 md:px-12 lg:px-24 text-left">
                {/* ページ遷移ボタン */}
                <div className="flex gap-4 mb-6">
                    <a href="/review-front" className="px-4 py-2 rounded bg-emerald-700 text-white font-semibold hover:bg-emerald-600">前半</a>
                    <a href="/review-back" className="px-4 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-600">後半</a>
                    <a href="/review-bonus" className="px-4 py-2 rounded bg-pink-700 text-white font-semibold hover:bg-pink-600">おまけ</a>
                </div>
                <ReviewTOC items={items} />
                {codeTabsSection}
                {/* ...existing code... */}
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
        </section><section id="tips" className="mb-12">
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
            </section><section id="ux" className="mb-12">
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
            </section></>
            </div>
        </Layout>
    );
}
