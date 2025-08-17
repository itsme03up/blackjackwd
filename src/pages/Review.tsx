// src/pages/Review.tsx
import { Callout } from "@/components/Callout";
import { DiffBlock } from "@/components/DiffBlock";
import { ReviewTOC } from "@/components/ReviewTOC";
import React from "react";
// 冒頭に追加
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/CodeBlock"
import Layout from "@/components/layout";

export default function Review() {
  const cCode = `#include <stdio.h>   // 入出力関数（printf, scanfなど）を使うためのヘッダ\n#include <stdlib.h>  // 標準ライブラリ（rand, srand, mallocなど）を使うためのヘッダ\n#include <time.h>    // 時間関数（time）を使うためのヘッダ（乱数の種に利用）\n\n// カード1枚の情報をまとめた構造体\ntypedef struct {\n    char* suit;   // カードのマーク（H, D, C, S）\n    char* rank;   // カードの数字や絵札（A, 2, 3, ..., K）\n    int value;    // ブラックジャックでの点数（A=11, J/Q/K=10 など）\n} Card;\n\n// 手札の合計値を計算する関数のプロトタイプ宣言\nint hand_value(Card hand[], int count);\n\n// -----------------------------------------------\n// 手札の合計値を計算する関数\n// A(エース)は11または1として扱い、21を超えないように調整する\n// -----------------------------------------------\nint hand_value(Card hand[], int count) {\n    int total = 0;   // 合計点\n    int aces = 0;    // エースの枚数カウント\n\n    // まず全カードを加算し、エースの数も数える\n    for (int i = 0; i < count; i++) {\n        total += hand[i].value;        // カードの点数を足す\n        if (hand[i].value == 11) aces++; // エースならカウント\n    }\n\n    // 合計が21を超える場合、エースを1点として扱って調整\n    while (total > 21 && aces > 0) {\n        total -= 10; // 11点のエースを1点に変更（差分は10点減らす）\n        aces--;      // エースの調整回数を減らす\n    }\n\n    return total; // 調整後の合計を返す\n}\n\n// -----------------------------------------------\n// 1枚のカードを表示する関数\n// -----------------------------------------------\nvoid print_card(Card c) {\n    printf(\"%s%s\", c.suit, c.rank); // 例: \"H10\" や \"DA\"\n}\n\n// -----------------------------------------------\n// 手札全体を表示する関数\n// -----------------------------------------------\nvoid show_hand(Card hand[], int count, const char* name) {\n    printf(\"%sの手札: \", name); // プレイヤー名を表示\n    for (int i = 0; i < count; i++) {\n        print_card(hand[i]);         // カードを表示\n        if (i < count - 1) printf(\" \"); // カード間にスペースを入れる\n    }\n    printf(\" (合計: %d)¥n\", hand_value(hand, count)); // 合計値も表示\n}\n\n// -----------------------------------------------\n// 52枚のカードデッキを作成する関数\n// -----------------------------------------------\nvoid create_deck(Card deck[]) {\n    // カードのマーク（ハート, ダイヤ, クラブ, スペード）\n    char* suits[] = { \"H\", \"D\", \"C\", \"S\" };\n    // カードのランク（A〜K）\n    char* ranks[] = { \"A\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"J\",\"Q\",\"K\" };\n    // ブラックジャックでのカードの点数\n    int values[] = { 11, 2,3,4,5,6,7,8,9,10,10,10,10 };\n\n    int index = 0; // デッキの現在の位置\n    for (int s = 0; s < 4; s++) {      // マークごとのループ\n        for (int r = 0; r < 13; r++) { // ランクごとのループ\n            deck[index].suit = suits[s];  // マーク設定\n            deck[index].rank = ranks[r];  // ランク設定\n            deck[index].value = values[r]; // 値設定\n            index++; // 次のカード位置へ\n        }\n    }\n}\n\n// -----------------------------------------------\n// デッキをシャッフル（ランダムに並べ替える）\n// -----------------------------------------------\nvoid shuffle_deck(Card deck[]) {\n    for (int i = 0; i < 52; i++) {\n        int j = rand() % 52; // 0〜51のランダムな位置を取得\n        // 位置iとjのカードを入れ替える\n        Card temp = deck[i];\n        deck[i] = deck[j];\n        deck[j] = temp;\n    }\n}\n\n// -----------------------------------------------\n// プレイヤーのターンを処理する関数\n// -----------------------------------------------\nint play_player(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2; // 最初の手札枚数は2枚\n    show_hand(hand, count, \"プレイヤー\"); // 初期手札を表示\n\n    // ヒット（カードを引く）かスタンド（引かない）を繰り返す\n    while (1) {\n        int total = hand_value(hand, count);\n        if (total == 21) { // 21なら自動的にスタンド\n            printf(\"21になったので自動的にスタンドします。¥n\");\n            break;\n        }\n        int choice;\n        printf(\"ヒット(1) か スタンド(0)？: \");\n        if (scanf(\"%d\", &choice) != 1) { // 入力エラー\n            printf(\"入力エラーです。スタンドします。¥n\");\n            while (getchar() != '¥n'); // バッファクリア\n            break;\n        }\n        if (choice == 1) { // ヒット\n            hand[count] = deck[(*deck_pos)++]; // デッキからカードを引く\n            printf(\"プレイヤーが引いたカード: \");\n            print_card(hand[count]);\n            count++;\n            printf(\" → 新しい合計: %d¥n\", hand_value(hand, count));\n            if (hand_value(hand, count) > 21) { // バースト判定\n                printf(\"プレイヤーはバースト！¥n\");\n                break;\n            }\n        }\n        else { // スタンド\n            break;\n        }\n    }\n    return hand_value(hand, count); // 最終的な合計値を返す\n}\n\n// -----------------------------------------------\n// ディーラーのターンを処理する関数\n// -----------------------------------------------\nint play_dealer(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2; // 初期手札は2枚\n    show_hand(hand, count, \"ディーラー\"); // ディーラー手札を表示\n\n    // ディーラーは17以上になるまでカードを引く\n    while (hand_value(hand, count) < 17) {\n        hand[count] = deck[(*deck_pos)++];\n        printf(\"ディーラーが引いたカード: \");\n        print_card(hand[count]);\n        count++;\n        printf(\" → 新しい合計: %d¥n\", hand_value(hand, count));\n    }\n    return hand_value(hand, count); // 最終的な合計値を返す\n}\n\n// -----------------------------------------------\n// ブラックジャック1ゲーム分を処理する関数\n// -----------------------------------------------\nint play_game(int money) {\n    int bet;\n    printf(\"現在の所持金: $%d¥n\", money);\n    printf(\"ベット額を入力してください: \");\n    // ベット額の入力とバリデーション\n    if (scanf(\"%d\", &bet) != 1 || bet <= 0 || bet > money) {\n        printf(\"無効なベット額です。最低1ドル、最大で現在の所持金までです。¥n\");\n        while (getchar() != '¥n'); // 入力バッファクリア\n        return money; // 所持金変化なし\n    }\n\n    Card deck[52]; // デッキ配列\n    create_deck(deck);   // デッキ作成\n    shuffle_deck(deck);  // デッキシャッフル\n\n    Card player_hand[12], dealer_hand[12]; // 手札（最大12枚程度）\n    int deck_pos = 0; // デッキの現在位置\n\n    // 最初の配り（プレイヤー2枚、ディーラー2枚）\n    player_hand[0] = deck[deck_pos++];\n    dealer_hand[0] = deck[deck_pos++];\n    player_hand[1] = deck[deck_pos++];\n    dealer_hand[1] = deck[deck_pos++];\n\n    printf(\"=== ブラックジャックへようこそ！ ===¥n\");\n\n    // プレイヤーターン\n    int player_score = play_player(deck, &deck_pos, player_hand);\n    if (player_score > 21) { // バースト\n        printf(\"ディーラーの勝ちです。¥n\");\n        money -= bet; // 負けた分を所持金から引く\n        printf(\"現在の所持金: $%d¥n\", money);\n        return money;\n    }\n\n    // ディーラーターン\n    int dealer_score = play_dealer(deck, &deck_pos, dealer_hand);\n    if (dealer_score > 21) { // ディーラーがバースト\n        printf(\"ディーラーはバースト！ プレイヤーの勝ちです。¥n\");\n        money += bet; // 勝ち分を追加\n        printf(\"現在の所持金: $%d¥n\", money);\n        return money;\n    }\n\n    // 勝敗判定\n    printf(\"プレイヤー: %d, ディーラー: %d¥n\", player_score, dealer_score);\n    if (player_score > dealer_score) { // プレイヤー勝利\n        printf(\"プレイヤーの勝ちです！¥n\");\n        money += bet;\n    }\n    else if (player_score < dealer_score) { // ディーラー勝利\n        printf(\"ディーラーの勝ちです。¥n\");\n        money -= bet;\n    }\n    else { // 引き分け\n        printf(\"引き分け！¥n\");\n        // 所持金変化なし\n    }\n    printf(\"現在の所持金: $%d¥n\", money);\n    return money;\n}\n\n// -----------------------------------------------\n// メイン関数（ゲーム全体のループ管理）\n// -----------------------------------------------\nint main() {\n    srand((unsigned int)time(NULL)); // 乱数の種を設定（毎回違うシャッフルになる）\n    int money = 100; // 初期所持金\n\n    // 所持金が尽きるまでゲームを繰り返す\n    while (money > 0) {\n        money = play_game(money); // 1ゲーム実行\n        if (money <= 0) { // 所持金が0以下で終了\n            printf(\"所持金がなくなりました。ゲーム終了です。¥n\");\n            break;\n        }\n        printf(\"¥n次のゲームを始めます...¥n¥n\");\n    }\n    return 0; // 正常終了\n}\n`;

  // --- ここからコード例変数定義 ---
  const handValueCCode = `int hand_value(Card hand[], int count) {
      int total = 0;
      int aces = 0;
      for (int i = 0; i < count; i++) {
          total += hand[i].value;
          if (hand[i].value == 11) aces++;
      }
      while (total > 21 && aces > 0) {
          total -= 10;
          aces--;
      }
      return total;
  }`;
  const handValueTSCode = `function handValue(hand: Card[]): number {
    let total = 0;
    let aces = 0;
    for (const card of hand) {
      total += card.value;
      if (card.value === 11) {
        aces++;
      }
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  }`;
  const handValueJSCode = `/**
   * @param {Card[]} hand
   * @returns {number}
   */
  function handValue(hand) {
    let total = 0;
    let aces = 0;
    for (const card of hand) {
      total += card.value;
      if (card.value === 11) {
        aces++;
      }
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  }`;
  const createDeckCCode = `void create_deck(Card deck[]) {
      char* suits[] = { "H", "D", "C", "S" };
      char* ranks[] = { "A","2","3","4","5","6","7","8","9","10","J","Q","K" };
      int values[] = { 11, 2,3,4,5,6,7,8,9,10,10,10,10 };
      int index = 0;
      for (int s = 0; s < 4; s++) {
          for (int r = 0; r < 13; r++) {
              deck[index].suit = suits[s];
              deck[index].rank = ranks[r];
              deck[index].value = values[r];
              index++;
          }
      }
  }`;
  const createDeckTSCode = `function createDeck(): Card[] {
    const suits = ["H", "D", "C", "S"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const deck: Card[] = [];
    for (const suit of suits) {
      for (let i = 0; i < ranks.length; i++) {
        deck.push({
          suit: suit,
          rank: ranks[i],
          value: values[i],
        });
      }
    }
    return deck;
  }`;
  const createDeckJSCode = `/** @returns {Card[]} */
  function createDeck() {
    const suits = ["H", "D", "C", "S"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const deck = [];
    for (const suit of suits) {
      for (let i = 0; i < ranks.length; i++) {
        deck.push({
          suit: suit,
          rank: ranks[i],
          value: values[i],
        });
      }
    }
    return deck;
  }`;
  const shuffleDeckCCode = `void shuffle_deck(Card deck[]) {
      for (int i = 0; i < 52; i++) {
          int j = rand() % 52;
          Card temp = deck[i];
          deck[i] = deck[j];
          deck[j] = temp;
      }
  }`;
  const shuffleDeckTSCode = `function shuffleDeck(deck: Card[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }`;
  const shuffleDeckJSCode = `/**
   * @param {Card[]} deck
   */
  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }`;
  const showHandCCode = `void print_card(Card c) {
      printf("%s%s", c.suit, c.rank);
  }
  void show_hand(Card hand[], int count, const char* name) {
      printf("%s's hand: ", name);
      for (int i = 0; i < count; i++) {
          print_card(hand[i]);
          if (i < count - 1) printf(" ");
      }
      printf(" (Total: %d)\n", hand_value(hand, count));
  }`;
  const showHandTSCode = `function printCard(card: Card): string {
    return card.suit + card.rank;
  }
  function showHand(hand: Card[], name: string): string {
    const cardsStr = hand.map(printCard).join(" ");
    const total = handValue(hand);
    return name + "'s hand: " + cardsStr + " (Total: " + total + ")";
  }`;
  const showHandJSCode = `/**
   * @param {Card} card
   * @returns {string}
   */
  function printCard(card) {
    return card.suit + card.rank;
  }
  /**
   * @param {Card[]} hand
   * @param {string} name
   * @returns {string}
   */
  function showHand(hand, name) {
    const cardsStr = hand.map(printCard).join(" ");
    const total = handValue(hand);
    return name + "'s hand: " + cardsStr + " (Total: " + total + ")";
  }`;
  const playerTurnCCode = `int play_player(Card deck[], int* deck_pos, Card hand[]) {
      int count = 2;
      show_hand(hand, count, "Player");
      while (1) {
          int total = hand_value(hand, count);
          if (total == 21) {
              printf("Auto-stand at 21.\n");
              break;
          }
          int choice;
          printf("Hit(1) or Stand(0)?: ");
          if (scanf("%d", &choice) != 1) {
              printf("Input error. Stand.\n");
              while (getchar() != '\n');
              break;
          }
          if (choice == 1) {
              hand[count] = deck[(*deck_pos)++];
              printf("Player drew: ");
              print_card(hand[count]);
              count++;
              printf(" -> New total: %d\n", hand_value(hand, count));
              if (hand_value(hand, count) > 21) {
                  printf("Player bust!\n");
                  break;
              }
          } else {
              break;
          }
      }
      return hand_value(hand, count);
  }`;
  const playerTurnTSCode = `async function playPlayerTurn(state: {
    deck: Card[];
    playerHand: Card[];
    deckPos: number;
  }): Promise<number> {
    const { deck, playerHand } = state;
    while (handValue(playerHand) < 21) {
      const choice = await promptUser("Hit(1) or Stand(0)?: ");
      if (choice === 1) {
        const newCard = deck[state.deckPos++];
        playerHand.push(newCard);
        console.log("Player drew: " + printCard(newCard));
        console.log("-> New total: " + handValue(playerHand));
      } else {
        break;
      }
    }
    const finalScore = handValue(playerHand);
    if (finalScore > 21) {
      console.log("Player bust!");
    }
    return finalScore;
  }`;
  const playerTurnJSCode = `/**
   * @param {{deck: Card[], playerHand: Card[], deckPos: number}} state
   * @returns {Promise<number>}
   */
  async function playPlayerTurn(state) {
    const { deck, playerHand } = state;
    while (handValue(playerHand) < 21) {
      const choice = await promptUser("Hit(1) or Stand(0)?: ");
      if (choice === 1) {
        const newCard = deck[state.deckPos++];
        playerHand.push(newCard);
        console.log("Player drew: " + printCard(newCard));
        console.log("-> New total: " + handValue(playerHand));
      } else {
        break;
      }
    }
    const finalScore = handValue(playerHand);
    if (finalScore > 21) {
      console.log("Player bust!");
    }
    return finalScore;
  }`;
  // --- ここまでコード例変数定義 ---

  return (
    <Layout>
      <div className="mx-auto max-w-5xl p-6 md:px-12 lg:px-24">
        {/* C言語全コード表示エリア */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">C言語ブラックジャック全コード</h2>
          <details className="mb-4">
            <summary className="cursor-pointer text-lg font-semibold text-zinc-200 bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700">クリックで展開/折りたたみ</summary>
            <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto text-xs whitespace-pre-wrap border border-zinc-800 mt-2 text-left">
              <code>{cCode}</code>
            </pre>
          </details>
        </section>
        {/* 既存の内容（比較・解説セクションなど） */}
        {/* セクション例：カード情報の構造体 */}
        <section className="mb-12"> 
          <h2 className="text-2xl font-semibold mb-4">1. カード情報の構造体</h2>
          <Tabs defaultValue="c" className="w-full">
          <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>

            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={`typedef struct { char* suit; char* rank; int value; } Card;`} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={`type Card = { suit: string; rank: string; value: number }`} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={`/** @typedef {{suit:string,rank:string,value:number}} Card */`} />
            </TabsContent>
          </Tabs>

          {/* レビュー要点 */}
          <ul className="mt-4 list-disc pl-6 text-zinc-300 text-sm leading-7">
            <li>JS では JSDoc typedef で型補完を効かせられる。</li>
            <li>TS の型は UI に依存しないのでロジック層に置くと再利用しやすい。</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Calculating Hand Value</h2>
          <p className="mb-2">The <code>hand_value</code> function determines the total score of a hand, handling Aces as 11 or 1.</p>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={handValueCCode} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={handValueTSCode} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={handValueJSCode} />
            </TabsContent>
          </Tabs>
          <ul className="mt-4 list-disc pl-6 text-zinc-300 text-sm leading-7">
            <li>The C function takes an array and a count. TS/JS use dynamic arrays and <code>for...of</code> loops.</li>
            <li>TypeScript provides type safety for the hand and return value.</li>
            <li>JavaScript uses JSDoc for type hints and tooling support.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. Creating the Deck</h2>
          <p className="mb-2">Creates a standard 52-card deck.</p>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={createDeckCCode} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={createDeckTSCode} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={createDeckJSCode} />
            </TabsContent>
          </Tabs>
          <ul className="mt-4 list-disc pl-6 text-zinc-300 text-sm leading-7">
            <li>C modifies the deck array in place. TS/JS typically return a new array.</li>
            <li>TS/JS use concise array creation and object literals.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Shuffling the Deck</h2>
          <p className="mb-2">Randomizes the order of the deck using Fisher-Yates shuffle.</p>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={shuffleDeckCCode} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={shuffleDeckTSCode} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={shuffleDeckJSCode} />
            </TabsContent>
          </Tabs>
          <ul className="mt-4 list-disc pl-6 text-zinc-300 text-sm leading-7">
            <li>C uses a forward loop; TS/JS use a backward loop for Fisher-Yates shuffle.</li>
            <li>TS/JS use destructuring assignment for swapping.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Displaying Cards and Hands</h2>
          <p className="mb-2">Shows the hand and its total value.</p>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={showHandCCode} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={showHandTSCode} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={showHandJSCode} />
            </TabsContent>
          </Tabs>
          <ul className="mt-4 list-disc pl-6 text-zinc-300 text-sm leading-7">
            <li>C uses <code>printf</code> for output; TS/JS return formatted strings for flexible display.</li>
            <li>TS/JS use <code>map</code> and <code>join</code> for concise card string creation.</li>
            <li>Template literals improve readability in TS/JS.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Player's Turn</h2>
          <p className="mb-2">Handles the player's choices to Hit or Stand, and checks for bust.</p>
          <Tabs defaultValue="c" className="w-full">
            <TabsList className="flex w-full">
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="ts">TypeScript</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="c" className="mt-4">
              <CodeBlock lang="c" code={playerTurnCCode} />
            </TabsContent>
            <TabsContent value="ts" className="mt-4">
              <CodeBlock lang="ts" code={playerTurnTSCode} />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <CodeBlock lang="js" code={playerTurnJSCode} />
            </TabsContent>
          </Tabs>
          <ul className="mt-4 list-disc pl-6 text-zinc-300 text-sm leading-7">
            <li>C uses blocking I/O; TS/JS use async input (e.g., <code>promptUser</code>).</li>
            <li>TS/JS update arrays directly; state is managed via objects.</li>
            <li>TS/JS use <code>push</code> for adding cards, not manual index/count.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. ゲーム全体の流れ</h2>
          <p className="mb-2">C言語のmain関数はループでゲームを管理します。TypeScript/Reactでは状態管理（useState, useReducer等）で同様の流れを作ります。</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">まとめ</h2>
          <p>C言語の各関数はTypeScriptでも関数・型として表現できます。UI部分（入力・表示）はReactのコンポーネントやイベントで置き換えます。<br />もし特定の部分のTypeScript実装例やReactコンポーネント化が必要であれば、詳細を指定してください。</p>
        </section>
      </div>
    </Layout>
  );
}
