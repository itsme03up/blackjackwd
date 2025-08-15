export default function Review() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold mb-4">C言語ブラックジャック実装のTypeScript比較・解説</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. カード情報の構造体</h2>
        <p className="mb-2">C言語では構造体でカード情報をまとめます。TypeScriptでは型エイリアスで表現します。</p>
        <div className="bg-gray-100 p-2 rounded text-sm mb-2 whitespace-pre-wrap font-mono">
{`
// C言語
typedef struct {
    char* suit;
    char* rank;
    int value;
} Card;

// TypeScript
type Card = {
  suit: string;
  rank: string;
  value: number;
};
`}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. 手札の合計値計算</h2>
        <p className="mb-2">A（エース）は11または1として扱い、合計が21を超えないように調整します。</p>
        <div className="bg-gray-100 p-2 rounded text-sm mb-2 whitespace-pre-wrap font-mono">
{`
// C言語
int hand_value(Card hand[], int count) {
    int total = 0, aces = 0;
    for (int i = 0; i < count; i++) {
        total += hand[i].value;
        if (hand[i].value == 11) aces++;
    }
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

// TypeScript
function handValue(hand: Card[]): number {
  let total = 0;
  let aces = 0;
  hand.forEach(card => {
    total += card.value;
    if (card.value === 11) aces++;
  });
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}
`}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. カードデッキの作成</h2>
        <p className="mb-2">52枚のカードデッキを作成します。</p>
        <div className="bg-gray-100 p-2 rounded text-sm mb-2 whitespace-pre-wrap font-mono">
{`
// C言語
void create_deck(Card deck[]) {
    char* suits[] = { "H", "D", "C", "S" };
    char* ranks[] = { "A","2","3",...,"K" };
    int values[] = { 11, 2, ..., 10 };
    int index = 0;
    for (int s = 0; s < 4; s++) {
        for (int r = 0; r < 13; r++) {
            deck[index].suit = suits[s];
            deck[index].rank = ranks[r];
            deck[index].value = values[r];
            index++;
        }
    }
}

// TypeScript
function createDeck(): Card[] {
  const suits = ["H", "D", "C", "S"];
  const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const values = [11,2,3,4,5,6,7,8,9,10,10,10,10];
  const deck: Card[] = [];
  suits.forEach(suit => {
    ranks.forEach((rank, i) => {
      deck.push({ suit, rank, value: values[i] });
    });
  });
  return deck;
}
`}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. デッキのシャッフル</h2>
        <p className="mb-2">デッキをランダムに並べ替えます。</p>
        <div className="bg-gray-100 p-2 rounded text-sm mb-2 whitespace-pre-wrap font-mono">
{`
// C言語
void shuffle_deck(Card deck[]) {
    for (int i = 0; i < 52; i++) {
        int j = rand() % 52;
        Card temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

// TypeScript
function shuffleDeck(deck: Card[]): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
`}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. 手札の表示</h2>
        <p className="mb-2">手札と合計値を表示します。</p>
        <div className="bg-gray-100 p-2 rounded text-sm mb-2 whitespace-pre-wrap font-mono">
{`
// C言語
void show_hand(Card hand[], int count, const char* name) {
    printf("%sの手札: ", name);
    for (int i = 0; i < count; i++) {
        print_card(hand[i]);
        if (i < count - 1) printf(" ");
    }
    printf(" (合計: %d)\n", hand_value(hand, count));
}

// TypeScript
function showHand(hand: Card[], name: string): void {
  const cards = hand.map(card => card.suit + card.rank).join(" ");
  console.log(\`\${name}の手札: \${cards} (合計: \${handValue(hand)})\`);
}
`}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. プレイヤー・ディーラーのターン処理</h2>
        <p className="mb-2">C言語では関数で手札を引くロジックを記述しています。TypeScriptではUIや入力処理が異なるため、Reactの状態管理やイベントで実装します。</p>
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
  )
}
