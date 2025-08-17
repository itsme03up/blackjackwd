// src/pages/Review.tsx
import { Callout } from "@/components/Callout";
import { DiffBlock } from "@/components/DiffBlock";
import { ReviewTOC } from "@/components/ReviewTOC";
import React from "react";
// 冒頭に追加
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Popover } from "@/components/ui/popover";
import { CodeBlock } from "@/components/CodeBlock"
import Layout from "@/components/layout";

export default function Review() {
    const cCode = `#include <stdio.h>   // 入出力関数（printf, scanfなど）を使うためのヘッダ\n#include <stdlib.h>  // 標準ライブラリ（rand, srand, mallocなど）を使うためのヘッダ\n#include <time.h>    // 時間関数（time）を使うためのヘッダ（乱数の種に利用）\n\n// カード1枚の情報をまとめた構造体\ntypedef struct {\n    char* suit;   // カードのマーク（H, D, C, S）\n    char* rank;   // カードの数字や絵札（A, 2, 3, ..., K）\n    int value;    // ブラックジャックでの点数（A=11, J/Q/K=10 など）\n} Card;\n\n// 手札の合計値を計算する関数のプロトタイプ宣言\nint hand_value(Card hand[], int count);\n\n// -----------------------------------------------\n// 手札の合計値を計算する関数\n// A(エース)は11または1として扱い、21を超えないように調整\n// -----------------------------------------------\nint hand_value(Card hand[], int count) {\n    int total = 0;   // 合計点\n    int aces = 0;    // エースの枚数カウント\n\n    // まず全カードを加算し、エースの数も数える\n    for (int i = 0; i < count; i++) {\n        total += hand[i].value;        // カードの点数を足す\n        if (hand[i].value == 11) aces++; // エースならカウント\n    }\n\n    // 合計が21を超える場合、エースを1点として扱って調整\n    while (total > 21 && aces > 0) {\n        total -= 10; // 11点のエースを1点に変更（差分は10点減らす）\n        aces--;      // エースの調整回数を減らす\n    }\n\n    return total; // 調整後の合計を返す\n}\n\n// -----------------------------------------------\n// 1枚のカードを表示する関数\n// -----------------------------------------------\nvoid print_card(Card c) {\n    printf(\"%s%s\", c.suit, c.rank); // 例: \"H10\" や \"DA\"\n}\n\n// -----------------------------------------------\n// 手札全体を表示する関数\n// -----------------------------------------------\nvoid show_hand(Card hand[], int count, const char* name) {\n    printf(\"%sの手札: \", name); // プレイヤー名を表示\n    for (int i = 0; i < count; i++) {\n        print_card(hand[i]);         // カードを表示\n        if (i < count - 1) printf(\" \"); // カード間にスペースを入れる\n    }\n    printf(\" (合計: %d)¥n\", hand_value(hand, count)); // 合計値も表示\n}\n\n// -----------------------------------------------\n// 52枚のカードデッキを作成する関数\n// -----------------------------------------------\nvoid create_deck(Card deck[]) {\n    // カードのマーク（ハート, ダイヤ, クラブ, スペード）\n    char* suits[] = { \"H\", \"D\", \"C\", \"S\" };\n    // カードのランク（A〜K）\n    char* ranks[] = { \"A\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"J\",\"Q\",\"K\" };\n    // ブラックジャックでのカードの点数\n    int values[] = { 11, 2,3,4,5,6,7,8,9,10,10,10,10 };\n\n    int index = 0; // デッキの現在の位置\n    for (int s = 0; s < 4; s++) {      // マークごとのループ\n        for (int r = 0; r < 13; r++) { // ランクごとのループ\n            deck[index].suit = suits[s];  // マーク設定\n            deck[index].rank = ranks[r];  // ランク設定\n            deck[index].value = values[r]; // 値設定\n            index++; // 次のカード位置へ\n        }\n    }\n}\n\n// -----------------------------------------------\n// デッキをシャッフル（ランダムに並べ替える）\n// -----------------------------------------------\nvoid shuffle_deck(Card deck[]) {\n    for (int i = 0; i < 52; i++) {\n        int j = rand() % 52; // 0〜51のランダムな位置を取得\n        // 位置iとjのカードを入れ替える\n        Card temp = deck[i];\n        deck[i] = deck[j];\n        deck[j] = temp;\n    }\n}\n\n// -----------------------------------------------\n// プレイヤーのターンを処理する関数\n// -----------------------------------------------\nint play_player(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2; // 最初の手札枚数は2枚\n    show_hand(hand, count, \"プレイヤー\"); // 初期手札を表示\n\n    // ヒット（カードを引く）かスタンド（引かない）を繰り返す\n    while (1) {\n        int total = hand_value(hand, count);\n        if (total == 21) { // 21なら自動的にスタンド\n            printf(\"21になったので自動的にスタンドします。¥n\");\n            break;\n        }\n        int choice;\n        printf(\"ヒット(1) か スタンド(0)？: \");\n        if (scanf(\"%d\", &choice) != 1) { // 入力エラー\n            printf(\"入力エラーです。スタンドします。¥n\");\n            while (getchar() != '¥n'); // バッファクリア\n            break;\n        }\n        if (choice == 1) { // ヒット\n            hand[count] = deck[(*deck_pos)++]; // デッキからカードを引く\n            printf(\"プレイヤーが引いたカード: \");\n            print_card(hand[count]);\n            count++;\n            printf(\" → 新しい合計: %d¥n\", hand_value(hand, count));\n            if (hand_value(hand, count) > 21) { // バースト判定\n                printf(\"プレイヤーはバースト！¥n\");\n                break;\n            }\n        }\n        else { // スタンド\n            break;\n        }\n    }\n    return hand_value(hand, count); // 最終的な合計値を返す\n}\n\n// -----------------------------------------------\n// ディーラーのターンを処理する関数\n// -----------------------------------------------\nint play_dealer(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2; // 初期手札は2枚\n    show_hand(hand, count, \"ディーラー\"); // ディーラー手札を表示\n\n    // ディーラーは17以上になるまでカードを引く\n    while (hand_value(hand, count) < 17) {\n        hand[count] = deck[(*deck_pos)++];\n        printf(\"ディーラーが引いたカード: \");\n        print_card(hand[count]);\n        count++;\n        printf(\" → 新しい合計: %d¥n\", hand_value(hand, count));\n    }\n    return hand_value(hand, count); // 最終的な合計値を返す\n}\n\n// -----------------------------------------------\n// ブラックジャック1ゲーム分を処理する関数\n// -----------------------------------------------\nint play_game(int money) {\n    int bet;\n    printf(\"現在の所持金: $%d¥n\", money);\n    printf(\"ベット額を入力してください: \");\n    // ベット額の入力とバリデーション\n    if (scanf(\"%d\", &bet) != 1 || bet <= 0 || bet > money) {\n        printf(\"無効なベット額です。最低1ドル、最大で現在の所持金までです。¥n\");\n        while (getchar() != '¥n'); // 入力バッファクリア\n        return money; // 所持金変化なし\n    }\n\n    Card deck[52]; // デッキ配列\n    create_deck(deck);   // デッキ作成\n    shuffle_deck(deck);  // デッキシャッフル\n\n    Card player_hand[12], dealer_hand[12]; // 手札（最大12枚程度）\n    int deck_pos = 0; // デッキの現在位置\n\n    // 最初の配り（プレイヤー2枚、ディーラー2枚）\n    player_hand[0] = deck[deck_pos++];\n    dealer_hand[0] = deck[deck_pos++];\n    player_hand[1] = deck[deck_pos++];\n    dealer_hand[1] = deck[deck_pos++];\n\n    printf(\"=== ブラックジャックへようこそ！ ===¥n\");\n\n    // プレイヤーターン\n    int player_score = play_player(deck, &deck_pos, player_hand);\n    if (player_score > 21) { // バースト\n        printf(\"ディーラーの勝ちです。¥n\");\n        money -= bet; // 負けた分を所持金から引く\n        printf(\"現在の所持金: $%d¥n\", money);\n        return money;\n    }\n\n    // ディーラーターン\n    int dealer_score = play_dealer(deck, &deck_pos, dealer_hand);\n    if (dealer_score > 21) { // ディーラーがバースト\n        printf(\"ディーラーはバースト！ プレイヤーの勝ちです。¥n\");\n        money += bet; // 勝ち分を追加\n        printf(\"現在の所持金: $%d¥n\", money);\n        return money;\n    }\n\n    // 勝敗判定\n    printf(\"プレイヤー: %d, ディーラー: %d¥n\", player_score, dealer_score);\n    if (player_score > dealer_score) { // プレイヤー勝利\n        printf(\"プレイヤーの勝ちです！¥n\");\n        money += bet;\n    }\n    else if (player_score < dealer_score) { // ディーラー勝利\n        printf(\"ディーラーの勝ちです。¥n\");\n        money -= bet;\n    }\n    else { // 引き分け\n        printf(\"引き分け！¥n\");\n        // 所持金変化なし\n    }\n    printf(\"現在の所持金: $%d¥n\", money);\n    return money;\n}\n\n// -----------------------------------------------\n// メイン関数（ゲーム全体のループ管理）\n// -----------------------------------------------\nint main() {\n    srand((unsigned int)time(NULL)); // 乱数の種を設定（毎回違うシャッフルになる）\n    int money = 100; // 初期所持金\n\n    // 所持金が尽きるまでゲームを繰り返す\n    while (money > 0) {\n        money = play_game(money); // 1ゲーム実行\n        if (money <= 0) { // 所持金が0以下で終了\n            printf(\"所持金がなくなりました。ゲーム終了です。¥n\");\n            break;\n        }\n        printf(\"¥n次のゲームを始めます...¥n¥n\");\n    }\n    return 0; // 正常終了\n}\n`;

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
      int values[]  = { 11, 2,3,4,5,6,7,8,9,10,10,10,10 };
      int index = 0;
      for (int s = 0; s < 4; s++) {
          for (int r = 0; r < 13; r++) {
              deck[index].suit  = suits[s];
              deck[index].rank  = ranks[r];
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
    const createDeckJSCode = `function createDeck() {
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
            <div className="mx-auto max-w-5xl p-6 md:px-12 lg:px-24 text-left">
                {/* C言語全コード表示エリア */}
                <section className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">ブラックジャック</h1>
                    {/* C言語全コード表示エリア（別の場所に移動） */}
                    <section className="mb-8">
                        <details className="mb-4">
                            <summary className="cursor-pointer text-lg font-semibold text-zinc-200 bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700">C言語全コード</summary>
                            <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto text-xs whitespace-pre-wrap border border-zinc-800 mt-2 text-left">
                                <code>{cCode}</code>
                            </pre>
                        </details>
                    </section>
                    <section className="mb-12">
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
                                        → <span>
                                            printf, scanf
                                        </span> など標準的な入出力を扱うために必要なヘッダです。<br />
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
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">カード１枚の情報をまとめた構造体</h2>
                        <Tabs defaultValue="c" className="w-full">
                            <TabsList className="flex w-full">
                                <TabsTrigger value="c">C</TabsTrigger>
                                <TabsTrigger value="ts">TypeScript</TabsTrigger>
                                <TabsTrigger value="js">JavaScript</TabsTrigger>
                            </TabsList>
                            <TabsContent value="c" className="mt-4">
                                <CodeBlock lang="c" code={`// カード1枚の情報をまとめた構造体\ntypedef struct {\n    char* suit;   // カードのマーク（H, D, C, S）\n    char* rank;   // カードの数字や絵札（A, 2, 3, ..., K）\n    int value;    // ブラックジャックでの点数（A=11, J/Q/K=10 など）\n} Card;`} />
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
                                <CodeBlock lang="ts" code={`type Card = { suit: string; rank: string; value: number }`} />
                            </TabsContent>
                            <TabsContent value="js" className="mt-4">
                                <CodeBlock lang="js" code={`/** @typedef {{suit:string,rank:string,value:number}} Card */`} />
                            </TabsContent>
                        </Tabs>
                    </section>
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">手札の合計値を計算する関数のプロトタイプ宣言</h2>
                        <Tabs defaultValue="c-header" className="w-full mb-4">
                            <TabsList className="flex w-full">
                                <TabsTrigger value="c-header">C</TabsTrigger>
                            </TabsList>
                            <TabsContent value="c-header" className="mt-4">
                                <CodeBlock lang="c" code={`int hand_value(Card hand[], int count);`} />
                                <div className="mt-4 text-zinc-200 text-sm leading-7">
                                    <p>ここでやっていること</p>
                                    <p>これは <b>関数プロトタイプ宣言</b> と呼ばれるものです。</p>
                                    <p><b>プロトタイプ宣言って何？</b><br />
                                        C言語では「この関数がどんな名前で、どんな引数を受け取り、どんな型を返すか」を <b>あらかじめコンパイラに教えておく必要</b> があります。<br />
                                        そうしないと、ソースの上から順に読むコンパイラが「この関数どんなの？知らん」となってエラーや警告を出します。</p>
                                    <p>例：</p>
                                    <CodeBlock lang="c" code={`int hand_value(Card hand[], int count); // ← 宣言`} />
                                    <ul className="list-disc pl-6">
                                        <li><b>int</b> は戻り値（返す型）</li>
                                        <li><b>hand_value</b> は関数名</li>
                                        <li><b>(Card hand[], int count)</b> は引数の型と名前</li>
                                    </ul>
                                    <p>これで「hand_value という関数は Card型の配列とintを受け取り、intを返す」と分かるわけです。</p>
                                    <h3 className="mt-4 text-lg font-semibold">JS / TSにあるか？</h3>
                                    <b>JavaScript</b><br />
                                    → JSには「プロトタイプ宣言」という概念はありません。<br />
                                    関数はファイル内でどこに書いても呼び出せます（関数宣言なら「巻き上げ（hoisting）」される）。<br />
                                    だから <code>function foo() &#123;&#125;</code> は前でも後でも呼べます。<br />
                                    つまり <b>宣言が自動的にされる言語</b> なんですね。
                                    <br /><br />
                                    <b>TypeScript</b><br />
                                    → TSもJSと同じく「関数プロトタイプ宣言」は不要です。<br />
                                    ただし型チェックのために <b>関数の型をインターフェースや型エイリアスで定義</b> することはあります。<br />
                                    例：
                                    <CodeBlock lang="ts" code={`type HandValue = (hand: Card[], count: number) => number;\nconst hand_value: HandValue = (hand, count) => { ... }`} />
                                    <p>これは「Cのプロトタイプ宣言」に役割がちょっと似ていて、型情報を先に教えておくという意味では近いです。</p>
                                    <h3 className="mt-4 text-lg font-semibold">まとめ</h3>
                                    <ul className="list-disc pl-6">
                                        <li>C言語 → プロトタイプ宣言が必須（関数の型と存在を前もって伝える）</li>
                                        <li>JS → 不要（自動で巻き上げされる）</li>
                                        <li>TS → 不要だが、型のためにインターフェースやtypeを使うことがある（Cっぽく感じる部分）</li>
                                    </ul>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">手札の合計値を計算する関数</h2>
                        <p className="mb-2">A(エース)は11または1として扱い、21を超えないように調整する</p>
                        <Tabs defaultValue="c" className="w-full">
                            <TabsList className="flex w-full">
                                <TabsTrigger value="c">C</TabsTrigger>
                                <TabsTrigger value="ts">TypeScript</TabsTrigger>
                                <TabsTrigger value="js">JavaScript</TabsTrigger>
                            </TabsList>
                            <TabsContent value="c" className="mt-4">
                                <CodeBlock lang="c" code={`int hand_value(Card hand[], int count) {\n    int total = 0;   // 合計点\n    int aces = 0;    // エースの枚数カウント\n    // まず全カードを加算し、エースの数も数える\n    for (int i = 0; i < count; i++) {\n        total += hand[i].value;        // カードの点数を足す\n        if (hand[i].value == 11) aces++; // エースならカウント\n    }\n    // 合計が21を超える場合、エースを1点として扱って調整\n    while (total > 21 && aces > 0) {\n        total -= 10; // 11点のエースを1点に変更（差分は10点減らす）\n        aces--;      // エースの調整回数を減らす\n    }\n    return total; // 調整後の合計を返す\n}`} />
                            </TabsContent>
                            <TabsContent value="ts" className="mt-4">
                                <CodeBlock lang="ts" code={`function handValue(hand: Card[]): number {\n    let total = 0;\n    let aces = 0;\n    for (const card of hand) {\n        total += card.value;\n        if (card.value === 11) aces++;\n    }\n    while (total > 21 && aces > 0) {\n        total -= 10;\n        aces--;\n    }\n    return total;\n}`} />
                            </TabsContent>
                            <TabsContent value="js" className="mt-4">
                                <CodeBlock lang="js" code={`function handValue(hand) {\n    let total = 0;\n    let aces = 0;\n    for (const card of hand) {\n        total += card.value;\n        if (card.value === 11) aces++;\n    }\n    while (total > 21 && aces > 0) {\n        total -= 10;\n        aces--;\n    }\n    return total;\n}`} />
                            </TabsContent>
                        </Tabs>
                        <div className="mt-4 text-zinc-200 text-sm leading-7">
                            <p><b>引数</b></p>
                            <ul className="list-disc pl-6">
                                <li><b>Card hand[]</b> … 手札（カードの配列）</li>
                                <li><b>int count</b> … その枚数</li>
                            </ul>
                            <p><b>ローカル変数</b></p>
                            <ul className="list-disc pl-6">
                                <li><b>total</b> … 手札の合計点を入れる</li>
                                <li><b>aces</b> … エース（A=11点）の数を数えておく</li>
                            </ul>
                            <p>手札を1枚ずつ見て点数を <b>total</b> に加算。同時に「11点のカード（=エース）」を数える。<br />
                                → エースは特別扱い（11 or 1 に変わる可能性がある）から。</p>
                            <p>もし合計が 21を超えてしまった（バーストしそう） 場合、まだエースが残っていれば 11点→1点に変換 して調整します。<br />
                                （11から1にするので 10点減らす）<br />
                                つまり「なるべく高い点数を維持しつつ、21を超えないようにする」ための処理ですね。</p>
                            <p>例：</p>
                            <ul className="list-disc pl-6">
                                <li>A + 9 = 20 → そのまま 20</li>
                                <li>A + 9 + 5 = 25 → エースを1に変える → 15</li>
                            </ul>
                            <p>最後に「バーストしないように調整済みの合計」を返します。</p>
                            <h3 className="mt-4 text-lg font-semibold">まとめると</h3>
                            <ul className="list-disc pl-6">
                                <li>全カードの点数を合計</li>
                                <li>エースの数を数える</li>
                                <li>合計が21を超えたら、エースを11→1にして調整</li>
                                <li>最終的な合計点を返す</li>
                            </ul>
                            <p>ブラックジャック特有の「エースの柔軟さ」をしっかり表現している関数でした。</p>
                        </div>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">カード・手札の表示関数</h2>
                        <Tabs defaultValue="c" className="w-full">
                            <TabsList className="flex w-full">
                                <TabsTrigger value="c">C</TabsTrigger>
                                <TabsTrigger value="ts">TypeScript</TabsTrigger>
                                <TabsTrigger value="js">JavaScript</TabsTrigger>
                            </TabsList>
                            <TabsContent value="c" className="mt-4">
                                <CodeBlock lang="c" code={`void print_card(Card c) {\n    printf("%s%s", c.suit, c.rank); // 例: "H10" や "DA"\n}\n\nvoid show_hand(Card hand[], int count, const char* name) {\n    printf("%sの手札: ", name); // プレイヤー名を表示\n    for (int i = 0; i < count; i++) {\n        print_card(hand[i]);         // カードを表示\n        if (i < count - 1) printf(" "); // カード間にスペースを入れる\n    }\n    printf(" (合計: %d)\n", hand_value(hand, count)); // 合計値も表示\n}`} />
                            </TabsContent>
                            <TabsContent value="ts" className="mt-4">
                                <CodeBlock lang="ts" code={`function printCard(card: Card): string {\n  return card.suit + card.rank;\n}\n\nfunction showHand(hand: Card[], name: string): string {\n  const cardsStr = hand.map(printCard).join(" ");\n  const total = handValue(hand);\n  return \`${'${name}'}の手札: ${'${cardsStr}'} (合計: ${'${total}'})\`;\n}`} />
                            </TabsContent>
                            <TabsContent value="js" className="mt-4">
                                <CodeBlock lang="js" code={`function printCard(card) {\n    return card.suit + card.rank;\n}\n\nfunction showHand(hand, name) {\n    const cardsStr = hand.map(printCard).join(" ");\n    const total = handValue(hand);\n    return name + "の手札: " + cardsStr + " (合計: " + total + ")";\n}`} />
                            </TabsContent>
                        </Tabs>
                        <div className="mt-4 text-zinc-200 text-sm leading-7">
                            <p><b>print_card</b> … カード1枚を「マーク＋ランク」で表示。</p>
                            <ul className="list-disc pl-6">
                                <li>引数は <b>カード1枚 (Card c)</b></li>
                                <li><code>printf("%s%s", c.suit, c.rank);</code> でマーク＋ランクを表示</li>
                                <li>例: suit = "H", rank = "10" → "H10" / suit = "D", rank = "A" → "DA"</li>
                            </ul>
                            <p>要するにカードを「マーク＋ランク」の文字列として出力する関数です。<br />
                                （見やすさのために、後でスペースを入れるのは別の関数でやっています）</p>
                            <p><b>show_hand</b> … 手札全体を「プレイヤー名＋カードの列＋合計点」で表示。</p>
                            <ul className="list-disc pl-6">
                                <li>引数: <b>Card hand[]</b>（手札の配列）、<b>int count</b>（枚数）、<b>const char* name</b>（プレイヤー名）</li>
                                <li><code>printf("%sの手札: ", name);</code> で「プレイヤーの手札: 」や「ディーラーの手札: 」と表示</li>
                                <li>forループで1枚ずつ <code>print_card(hand[i])</code> を呼ぶ</li>
                                <li>if (i &lt; count - 1) でカード間にスペースを入れる</li>
                                <li>最後に <code>printf(" (合計: %d)\n", hand_value(hand, count));</code> で合計点数を表示</li>
                            </ul>
                            <p>出力イメージ例：<br />
                                <code>プレイヤーの手札: HA D10 (合計: 21)</code>
                            </p>
                            <h3 className="mt-4 text-lg font-semibold">まとめ</h3>
                            <ul className="list-disc pl-6">
                                <li>print_card … カード1枚を「マーク＋ランク」で表示</li>
                                <li>show_hand … 手札全体を「プレイヤー名＋カードの列＋合計点」で表示</li>
                            </ul>
                        </div>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">52枚のカードデッキを作成する関数</h2>
                        <div className="mb-4 text-zinc-200 text-sm leading-7">
                            <p>ブラックジャックで使う「52枚の山札」を最初に一気に作る関数です。<br />
                                1枚ずつ手作業で作るのは大変なので、<b>forループ</b>で <b>4 × 13 = 52枚</b> を自動生成します。</p>
                        </div>
                        <Tabs defaultValue="c" className="w-full">
                            <TabsList className="flex w-full">
                                <TabsTrigger value="c">C</TabsTrigger>
                                <TabsTrigger value="ts">TypeScript</TabsTrigger>
                                <TabsTrigger value="js">JavaScript</TabsTrigger>
                            </TabsList>
                            <TabsContent value="c" className="mt-4">
                                <CodeBlock lang="c" code={`void create_deck(Card deck[]) {\n    char* suits[] = { \"H\", \"D\", \"C\", \"S\" };\n    char* ranks[] = { \"A\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"J\",\"Q\",\"K\" };\n    int values[]  = { 11, 2,3,4,5,6,7,8,9,10,10,10,10 };\n\n    int index = 0;\n    for (int s = 0; s < 4; s++) {\n        for (int r = 0; r < 13; r++) {\n            deck[index].suit  = suits[s];\n            deck[index].rank  = ranks[r];\n            deck[index].value = values[r];\n            index++;\n        }\n    }\n}`} />
                            </TabsContent>
                            <TabsContent value="ts" className="mt-4">
                                <CodeBlock lang="ts" code={`function createDeck(): Card[] {\n  const suits = [\"H\", \"D\", \"C\", \"S\"];\n  const ranks = [\"A\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"J\",\"Q\",\"K\"];\n  const values = [11,2,3,4,5,6,7,8,9,10,10,10,10];\n  const deck: Card[] = [];\n  for (let s = 0; s < 4; s++) {\n    for (let r = 0; r < 13; r++) {\n      deck.push({\n        suit: suits[s],\n        rank: ranks[r],\n        value: values[r]\n      });\n    }\n  }\n  return deck;\n}`} />
                            </TabsContent>
                            <TabsContent value="js" className="mt-4">
                                <CodeBlock lang="js" code={`function createDeck() {\n  const suits = [\"H\", \"D\", \"C\", \"S\"];\n  const ranks = [\"A\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"J\",\"Q\",\"K\"];\n  const values = [11,2,3,4,5,6,7,8,9,10,10,10,10];\n  const deck = [];\n  for (let s = 0; s < 4; s++) {\n    for (let r = 0; r < 13; r++) {\n      deck.push({\n        suit: suits[s],\n        rank: ranks[r],\n        value: values[r]\n      });\n    }\n  }\n  return deck;\n}`} />
                            </TabsContent>
                        </Tabs>
                        <div className="mt-4 text-zinc-200 text-sm leading-7">
                            <h3 className="text-lg font-semibold mb-2">各配列の意味</h3>
                            <ul className="list-disc pl-6">
                                <li><b>suits[]</b> = <code>{'{"H", "D", "C", "S"}'}</code><br />→ 4種類のマーク（♥ハート, ♦ダイヤ, ♣クラブ, ♠スペード）</li>
                                <li><b>ranks[]</b> = <code>{'{"A", "2", ..., "K"}'}</code><br />→ 13種類のランク（A, 2〜10, J, Q, K）</li>
                                <li><b>values[]</b> = <code>{'{11, 2, ..., 10, 10, 10, 10}'}</code><br />→ ブラックジャックでの点数（A=11, 2〜10=数字通り, J/Q/K=10）</li>
                            </ul>
                            <h3 className="text-lg font-semibold mt-4 mb-2">ループ部分の解説</h3>
                            <ul className="list-disc pl-6">
                                <li>外側ループ: 4種類のマーク（suits）</li>
                                <li>内側ループ: 13種類のランク（ranks）</li>
                                <li>deck[index]（C）/ deck.push（TS/JS）で1枚ずつカードを生成</li>
                            </ul>
                            <h3 className="text-lg font-semibold mt-4 mb-2">実際の生成例（冒頭）</h3>
                            <ul className="list-disc pl-6">
                                <li>deck[0] = H A (11)</li>
                                <li>deck[1] = H 2 (2)</li>
                                <li>...（HのKまで）</li>
                                <li>deck[13] = D A (11)</li>
                                <li>...（DのKまで）</li>
                                <li>deck[51] = S K (10)</li>
                            </ul>
                            <h3 className="text-lg font-semibold mt-4 mb-2">まとめ</h3>
                            <ul className="list-disc pl-6">
                                <li>4スート × 13ランク = 52枚をループで一気に生成</li>
                                <li>Card構造体（C）/オブジェクト（TS/JS）に「マーク・ランク・点数」を代入</li>
                                <li>これで山札が完成！</li>
                            </ul>
                        </div>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">デッキをシャッフル（ランダムに並べ替える）</h2>
                        <div className="mb-4 text-zinc-200 text-sm leading-7">
                            <p>せっかく <b>create_deck</b> で綺麗に「H A, H 2, … S K」と順番に作ったカードを、乱数でごちゃ混ぜにする関数です。<br />
                                いわゆる「シャッフル処理」ですね。</p>
                        </div>
                        <Tabs defaultValue="c" className="w-full">
                            <TabsList className="flex w-full">
                                <TabsTrigger value="c">C</TabsTrigger>
                                <TabsTrigger value="ts">TypeScript</TabsTrigger>
                                <TabsTrigger value="js">JavaScript</TabsTrigger>
                            </TabsList>
                            <TabsContent value="c" className="mt-4">
                                <CodeBlock lang="c" code={`void shuffle_deck(Card deck[]) {\n    for (int i = 0; i < 52; i++) {\n        int j = rand() % 52; // 0〜51のランダムな位置を取得\n        Card temp = deck[i];\n        deck[i] = deck[j];\n        deck[j] = temp;\n    }\n}`} />
                            </TabsContent>
                            <TabsContent value="ts" className="mt-4">
                                <CodeBlock lang="ts" code={`function shuffleDeck(deck: Card[]): void {\n  for (let i = 0; i < 52; i++) {\n    const j = Math.floor(Math.random() * 52); // 0〜51のランダムな位置\n    [deck[i], deck[j]] = [deck[j], deck[i]]; // 分割代入でスワップ\n  }\n}`} />
                            </TabsContent>
                            <TabsContent value="js" className="mt-4">
                                <CodeBlock lang="js" code={`function shuffleDeck(deck) {\n  for (let i = 0; i < 52; i++) {\n    const j = Math.floor(Math.random() * 52);\n    const temp = deck[i];\n    deck[i] = deck[j];\n    deck[j] = temp;\n  }\n}`} />
                            </TabsContent>
                        </Tabs>
                        <div className="mt-4 text-zinc-200 text-sm leading-7">
                            <h3 className="text-lg font-semibold mb-2">使っている仕組み</h3>
                            <ul className="list-disc pl-6">
                                <li><b>rand()</b>（C）/ <b>Math.random()</b>（TS/JS）… 乱数生成関数</li>
                                <li><b>rand() % 52</b> / <b>Math.floor(Math.random() * 52)</b> … 0〜51の範囲の乱数</li>
                                <li>deck[i] と deck[j] を一時変数や分割代入でスワップ</li>
                            </ul>
                            <h3 className="text-lg font-semibold mt-4 mb-2">処理の意味</h3>
                            <ul className="list-disc pl-6">
                                <li><code>for (i = 0; i &lt; 52; i++)</code> … 52枚のカードを順番に見ていく</li>
                                <li><code>j = ランダムな位置を決める</code></li>
                                <li><code>deck[i] と deck[j] を入れ替える（スワップ）</code></li>
                            </ul>
                            <h3 className="text-lg font-semibold mt-4 mb-2">例</h3>
                            <ul className="list-disc pl-6">
                                <li>もし i=0 のときに j=37 が出たら：deck[0] と deck[37] が交換される</li>
                                <li>これを i=0〜51 まで繰り返すので、最終的には山札がランダム順に入れ替わる</li>
                            </ul>
                            <h3 className="text-lg font-semibold mt-4 mb-2">注意点（豆知識）</h3>
                            <ul className="list-disc pl-6">
                                <li>この実装は「完全に公平なシャッフル（Fisher-Yates shuffle）」ではありません</li>
                                <li>理想は「iから最後までの中でランダムに選んで交換する」方式</li>
                                <li>今のコードは「全範囲から毎回ランダムに選んで交換する」ので、理論的には偏りが出ます</li>
                                <li>でも、ゲームとしては十分ランダムに見えるので、実用的には問題なし</li>
                            </ul>
                            <h3 className="text-lg font-semibold mt-4 mb-2">まとめ</h3>
                            <ul className="list-disc pl-6">
                                <li>shuffle_deck は 52 枚のデッキをランダム順に入れ替える関数</li>
                                <li>rand() % 52 / Math.random() でランダムな位置を選び、スワップする方式</li>
                                <li>完全公平ではないけど、実用的にはOK</li>
                            </ul>
                        </div>
                    </section>
                </section>
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">プレイヤーのターンを処理する関数</h2>
                    <div className="mb-4 text-zinc-200 text-sm leading-7">
                        <p>ここがいよいよ「プレイヤーのターン」の処理ですね。<br />
                            人間が操作する部分なので、<b>入力のやり取り</b>と<b>ゲームルールのチェック</b>が詰まっています。</p>
                    </div>
                    <Tabs defaultValue="c" className="w-full">
                        <TabsList className="flex w-full">
                            <TabsTrigger value="c">C</TabsTrigger>
                            <TabsTrigger value="ts">TypeScript</TabsTrigger>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                        </TabsList>
                        <TabsContent value="c" className="mt-4">
                            <CodeBlock lang="c" code={`int play_player(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2; // 最初の手札枚数は2枚\n    show_hand(hand, count, "プレイヤー");\n    while (1) {\n        int total = hand_value(hand, count);\n        if (total == 21) {\n            printf("21になったので自動的にスタンドします。¥n\");\n            break;\n        }\n        int choice;\n        printf("ヒット(1) か スタンド(0)？: ");\n        if (scanf("%d", &choice) != 1) {\n            printf("入力エラーです。スタンドします。¥n\");\n            while (getchar() != '¥n'); // バッファクリア\n            break;\n        }\n        if (choice == 1) { // ヒット\n            hand[count] = deck[(*deck_pos)++]; // デッキからカードを引く\n            printf("プレイヤーが引いたカード: ");\n            print_card(hand[count]);\n            count++;\n            printf(" → 新しい合計: %d¥n", hand_value(hand, count));\n            if (hand_value(hand, count) > 21) { // バースト判定\n                printf("プレイヤーはバースト！¥n\");\n                break;\n            }\n        }\n        else { // スタンド\n            break;\n        }\n    }\n    return hand_value(hand, count); // 最終的な合計値を返す\n}`} />
                        </TabsContent>
                        <TabsContent value="ts" className="mt-4">
                            <CodeBlock lang="ts" code={`function playPlayer(deck: Card[], deckPos: { value: number }, hand: Card[]): number {
  let count = 2; // 最初の手札枚数は2枚
  showHand(hand, "プレイヤー");
  while (true) {
    const total = handValue(hand);
    if (total === 21) {
      alert("21になったので自動的にスタンドします。");
      break;
    }
    const choice = window.confirm("ヒットしますか？（OK=ヒット, キャンセル=スタンド）");
    if (choice) {
      hand.push(deck[deckPos.value++]);
      showHand(hand, "プレイヤー");
      if (handValue(hand) > 21) {
        alert("プレイヤーはバースト！");
        break;
      }
    } else {
      break;
    }
  }
  return handValue(hand);
}`} />
                        </TabsContent>
                        <TabsContent value="js" className="mt-4">
                            <CodeBlock lang="js" code={`function playPlayer(deck, deckPos, hand) {\n  let count = 2;\n  showHand(hand, "プレイヤー");\n  while (true) {\n    var total = handValue(hand);\n    if (total === 21) {\n      alert("21になったので自動的にスタンドします。");\n      break;\n    }\n    var choice = window.confirm("ヒットしますか？（OK=ヒット, キャンセル=スタンド）");\n    if (choice) {\n      hand.push(deck[deckPos.value++]);\n      showHand(hand, "プレイヤー");\n      if (handValue(hand) > 21) {\n        alert("プレイヤーはバースト！");\n        break;\n      }\n    } else {\n      break;\n    }\n  }\n  return handValue(hand);\n}`} />
                        </TabsContent>
                    </Tabs>
                    <div className="mt-4 text-zinc-200 text-sm leading-7">
                        <h3 className="text-lg font-semibold mb-2">関数のシグネチャと引数</h3>
                        <ul className="list-disc pl-6">
                            <li><code>Card deck[]</code> … 52枚のデッキ全体</li>
                            <li><code>int* deck_pos</code> … デッキの「次に引く位置」を指すポインタ</li>
                            <li><code>Card hand[]</code> … プレイヤーの手札配列</li>
                            <li>戻り値：最終的な合計点（バーストしたら21超えの数が返る）</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">処理の流れ</h3>
                        <ul className="list-disc pl-6">
                            <li>2枚で開始 → 手札を表示</li>
                            <li>ループ：21なら自動スタンド</li>
                            <li>入力で「1=ヒット / 0=スタンド」</li>
                            <li>ヒットならカードを引き、バースト判定。入力が数字でない場合は「エラー扱い → 強制スタンド」</li>
                            <li>ループを抜けたら 合計点を返す。while (getchar() != '\n'); は、余分に入力された文字（改行など）を読み捨ててバッファをクリアするおまじない。</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">ポイント解説</h3>
                        <ul className="list-disc pl-6">
                            <li>最初に2枚配る（count=2）</li>
                            <li>show_handで手札と合計を表示</li>
                            <li>while(1)で無限ループ、ヒット/スタンドで抜ける</li>
                            <li>入力エラー時は強制スタンド</li>
                            <li>ヒット時はカード追加・バースト判定</li>
                            <li>スタンド時はそのまま終了</li>
                            <li>最終的な合計点を返す</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">まとめ</h3>
                        <ul className="list-disc pl-6">
                            <li>プレイヤーのターン処理は「入力→判定→結果返却」の流れ</li>
                            <li>人間の操作・ルール判定・バースト処理が詰まっている</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">ディーラーのターンを処理する関数</h2>
                    <div className="mb-4 text-zinc-200 text-sm leading-7">
                        <p>ここが「ディーラーのターン」の処理部分ですね。<br />
                            プレイヤーのターンと違って「入力」が無く、機械的にルール通り進むのが特徴です。</p>
                    </div>
                    <Tabs defaultValue="c" className="w-full">
                        <TabsList className="flex w-full">
                            <TabsTrigger value="c">C</TabsTrigger>
                            <TabsTrigger value="ts">TypeScript</TabsTrigger>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                        </TabsList>
                        <TabsContent value="c" className="mt-4">
                            <CodeBlock lang="c" code={`int play_dealer(Card deck[], int* deck_pos, Card hand[]) {\n    int count = 2;\n    show_hand(hand, count, "ディーラー");\n    while (hand_value(hand, count) < 17) {\n        hand[count] = deck[(*deck_pos)++];\n        printf("ディーラーが引いたカード: ");\n        print_card(hand[count]);\n        count++;\n        printf(" → 新しい合計: %d\n", hand_value(hand, count));\n    }\n    return hand_value(hand, count);\n}`} />
                        </TabsContent>
                        <TabsContent value="ts" className="mt-4">
                            <CodeBlock lang="ts" code={`function playDealer(deck: Card[], deckPos: { value: number }, hand: Card[]): number {
  let count = 2;
  showHand(hand, "ディーラー");
  while (handValue(hand) < 17) {
    hand.push(deck[deckPos.value++]);
    showHand(hand, "ディーラー");
  }
  return handValue(hand);
}`} />
                        </TabsContent>
                        <TabsContent value="js" className="mt-4">
                            <CodeBlock lang="js" code={`function playDealer(deck, deckPos, hand) {\n  let count = 2;\n  showHand(hand, "ディーラー");\n  while (handValue(hand) < 17) {\n    hand.push(deck[deckPos.value++]);\n    showHand(hand, "ディーラー");\n  }\n  return handValue(hand);\n}`} />
                        </TabsContent>
                    </Tabs>
                    <div className="mt-4 text-zinc-200 text-sm leading-7">
                        <h3 className="text-lg font-semibold mb-2">関数シグネチャと引数</h3>
                        <ul className="list-disc pl-6">
                            <li><code>Card deck[]</code> … 山札</li>
                            <li><code>int* deck_pos</code> … 次に引くカードの位置（ポインタ）</li>
                            <li><code>Card hand[]</code> … ディーラーの手札</li>
                            <li>戻り値 … ディーラーの最終的な合計点</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">初期状態</h3>
                        <ul className="list-disc pl-6">
                            <li>int count = 2; // 初期手札は2枚</li>
                            <li>show_hand(hand, count, "ディーラー");</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">ディーラーのルール</h3>
                        <ul className="list-disc pl-6">
                            <li>合計が17以上になるまでカードを引き続ける（16以下ならヒット、17以上でストップ）</li>
                            <li>引いたカードはその場で表示し、合計点も出す</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">結果を返す</h3>
                        <ul className="list-disc pl-6">
                            <li>return hand_value(hand, count); // 最終的な合計を返す。バーストしていたら22以上</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">プレイヤーとの違い</h3>
                        <ul className="list-disc pl-6">
                            <li>プレイヤー：自分の意思でヒット/スタンドを選べる</li>
                            <li>ディーラー：ルール固定（17以上になるまでヒット）</li>
                            <li>この違いがブラックジャックの「プレイヤー有利」要素</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">出力イメージ</h3>
                        <ul className="list-disc pl-6">
                            <li>例：ディーラーの手札が「D5, H9」だったら合計14 → 17未満なのでヒット</li>
                            <li>ディーラーの手札: D5 H9 (合計: 14)</li>
                            <li>ディーラーが引いたカード: C7 → 新しい合計: 21</li>
                            <li>ここで21に達したのでストップ</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">ブラックジャック1ゲーム分を処理する関数</h2>
                    <div className="mb-4 text-zinc-200 text-sm leading-7">
                        <p>ここがブラックジャックの1ゲーム分の本体です。<br />
                            「デッキ生成 → シャッフル → プレイヤーターン → ディーラーターン → 勝敗判定」を一通りまとめています。</p>
                    </div>
                    <Tabs defaultValue="c" className="w-full">
                        <TabsList className="flex w-full">
                            <TabsTrigger value="c">C</TabsTrigger>
                            <TabsTrigger value="ts">TypeScript</TabsTrigger>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                        </TabsList>
                        <TabsContent value="c" className="mt-4">
                            <CodeBlock lang="c" code={`int play_game(int money) {\n    int bet;\n    printf("現在の所持金: $%d\n", money);\n    printf("ベット額を入力してください: ");\n    if (scanf("%d", &bet) != 1 || bet <= 0 || bet > money) {\n        printf("無効なベット額です。最低1ドル、最大で現在の所持金までです。\n");\n        while (getchar() != '\n');\n        return money;\n    }\n    Card deck[52];\n    create_deck(deck);\n    shuffle_deck(deck);\n    Card player_hand[12], dealer_hand[12];\n    int deck_pos = 0;\n    player_hand[0] = deck[deck_pos++];\n    dealer_hand[0] = deck[deck_pos++];\n    player_hand[1] = deck[deck_pos++];\n    dealer_hand[1] = deck[deck_pos++];\n    printf("=== ブラックジャックへようこそ！ ===\n");\n    int player_score = play_player(deck, &deck_pos, player_hand);\n    if (player_score > 21) {\n        printf("ディーラーの勝ちです。\n");\n        money -= bet;\n        printf("現在の所持金: $%d\n", money);\n        return money;\n    }\n    int dealer_score = play_dealer(deck, &deck_pos, dealer_hand);\n    if (dealer_score > 21) {\n        printf("ディーラーはバースト！ プレイヤーの勝ちです。\n");\n        money += bet;\n        printf("現在の所持金: $%d\n", money);\n        return money;\n    }\n    printf("プレイヤー: %d, ディーラー: %d\n", player_score, dealer_score);\n    if (player_score > dealer_score) {\n        printf("プレイヤーの勝ちです！\n");\n        money += bet;\n    } else if (player_score < dealer_score) {\n        printf("ディーラーの勝ちです。\n");\n        money -= bet;\n    } else {\n        printf("引き分け！\n");\n    }\n    printf("現在の所持金: $%d\n", money);\n    return money;\n}`} />
                        </TabsContent>
                        <TabsContent value="ts" className="mt-4">
                            <CodeBlock lang="ts" code={`function playGame(money: number): number {
  let bet = Number(prompt('現在の所持金: $' + money + '\\nベット額を入力してください:'));
  if (!Number.isFinite(bet) || bet <= 0 || bet > money) {
    alert('無効なベット額です。最低1ドル、最大で現在の所持金までです。');
    return money;
  }
  const deck = createDeck();
  shuffleDeck(deck);
  const playerHand: Card[] = [deck[0], deck[2]];
  const dealerHand: Card[] = [deck[1], deck[3]];
  let deckPos = 4;
  alert('=== ブラックジャックへようこそ！ ===');
  const playerScore = playPlayer(deck, { value: deckPos }, playerHand);
  deckPos = playerHand.length + dealerHand.length;
  if (playerScore > 21) {
    alert('ディーラーの勝ちです。');
    money -= bet;
    alert('現在の所持金: $' + money);
    return money;
  }
  const dealerScore = playDealer(deck, { value: deckPos }, dealerHand);
  if (dealerScore > 21) {
    alert('ディーラーはバースト！ プレイヤーの勝ちです。');
    money += bet;
    alert('現在の所持金: $' + money);
    return money;
  }
  alert('プレイヤー: ' + playerScore + ', ディーラー: ' + dealerScore);
  if (playerScore > dealerScore) {
    alert('プレイヤーの勝ちです！');
    money += bet;
  } else if (playerScore < dealerScore) {
    alert('ディーラーの勝ちです。');
    money -= bet;
  } else {
    alert('引き分け！');
  }
  alert('現在の所持金: $' + money);
  return money;
}`} />
                        </TabsContent>
                        <TabsContent value="js" className="mt-4">
                            <CodeBlock lang="js" code={`function playGame(money) {\n  var bet = Number(prompt('現在の所持金: $' + money + '\nベット額を入力してください:'));\n  if (!isFinite(bet) || bet <= 0 || bet > money) {\n    alert('無効なベット額です。最低1ドル、最大で現在の所持金までです。');\n    return money;\n  }\n  var deck = createDeck();\n  shuffleDeck(deck);\n  var playerHand = [deck[0], deck[2]];\n  var dealerHand = [deck[1], deck[3]];\n  var deckPos = 4;\n  alert('=== ブラックジャックへようこそ！ ===');\n  var playerScore = playPlayer(deck, { value: deckPos }, playerHand);\n  deckPos = playerHand.length + dealerHand.length;\n  if (playerScore > 21) {\n    alert('ディーラーの勝ちです。');\n    money -= bet;\n    alert('現在の所持金: $' + money);\n    return money;\n  }\n  var dealerScore = playDealer(deck, { value: deckPos }, dealerHand);\n  if (dealerScore > 21) {\n    alert('ディーラーはバースト！ プレイヤーの勝ちです。');\n    money += bet;\n    alert('現在の所持金: $' + money);\n    return money;\n  }\n  alert('プレイヤー: ' + playerScore + ', ディーラー: ' + dealerScore);\n  if (playerScore > dealerScore) {\n    alert('プレイヤーの勝ちです！');\n    money += bet;\n  } else if (playerScore < dealerScore) {\n    alert('ディーラーの勝ちです。');\n    money -= bet;\n  } else {\n    alert('引き分け！');\n  }\n  alert('現在の所持金: $' + money);\n  return money;\n}`} />
                        </TabsContent>
                    </Tabs>
                    <div className="mt-4 text-zinc-200 text-sm leading-7">
                        <h3 className="text-lg font-semibold mb-2">関数シグネチャと引数</h3>
                        <ul className="list-disc pl-6">
                            <li><code>int play_game(int money)</code> … プレイヤーの所持金を受け取り、ゲーム後の所持金を返す</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">ベット額の入力とチェック</h3>
                        <ul className="list-disc pl-6">
                            <li>所持金を表示し、ベット額を入力</li>
                            <li>数字じゃない・0以下・所持金以上は無効</li>
                            <li>無効ならそのまま return money;</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">デッキ作成と初期配り</h3>
                        <ul className="list-disc pl-6">
                            <li>52枚のデッキを作成 → シャッフル</li>
                            <li>プレイヤー・ディーラーに2枚ずつ配る</li>
                            <li>deck_pos が「山札のどこまで進んだか」を管理</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">プレイヤーのターン</h3>
                        <ul className="list-disc pl-6">
                            <li>プレイヤーが操作（ヒット or スタンド）</li>
                            <li>21を超えたら即終了 → ディーラーの勝ち</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">ディーラーのターン</h3>
                        <ul className="list-disc pl-6">
                            <li>ディーラーは17以上になるまで自動でカードを引く</li>
                            <li>21を超えたらバースト → プレイヤーの勝ち</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">勝敗判定</h3>
                        <ul className="list-disc pl-6">
                            <li>プレイヤーとディーラーの点数を比較</li>
                            <li>多い方が勝ち → ベットの増減</li>
                            <li>同点なら引き分け</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">最終結果を返す</h3>
                        <ul className="list-disc pl-6">
                            <li>所持金を更新して返す</li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-4 mb-2">まとめ</h3>
                        <ul className="list-disc pl-6">
                            <li>ベット額を決める</li>
                            <li>デッキ作成 → シャッフル</li>
                            <li>プレイヤー・ディーラーに2枚配る</li>
                            <li>プレイヤーターン → バーストしたら終了</li>
                            <li>ディーラーターン → バーストしたら終了</li>
                            <li>それ以外は点数を比べて勝敗判定</li>
                            <li>所持金を更新して返す</li>
                        </ul>
                    </div>
                </section>
             
            </div>
        </Layout>
    );
}
