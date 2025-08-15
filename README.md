# 🃏 blackjack-gopnik-style
  
ネオンとコードが交差するブラックジャックの世界へようこそ！
川田の美しいC言語で書かれたブラックジャックをTS化してしゃぶり尽くす
全力でふざけたブラックジャックを楽しもう！


## 📁 プロジェクト構成

```
blackjack-gopnik-style/
├── public/                 # 画像・フォント・効果音などのアセット
│   ├── images/
│   ├── sounds/
│   └── fonts/
├── src/
│   ├── components/         # React コンポーネント（Card, DealerKawada, etc）
│   ├── pages/
│   │   ├── Landing.tsx     # ランディングページ（開始前紹介）
│   │   ├── Game.tsx        # ブラックジャックゲーム本体
│   │   └── Review.tsx      # コード解析ページ
│   ├── styles/             # Tailwind CSS や追加スタイル
│   ├── assets.ts           # 画像/音声のインポート
│   └── App.tsx             # ルーティングと全体構成
├── index.html
├── package.json
├── tsconfig.json
└── README.md               
```

## 🚀 使用技術

- **React + TypeScript**
- **Vite**
- **Tailwind CSS**
- **SVGアニメーション（カードやUIエフェクト）**
- **AI生成画像　ChatGPT**
- **AI生成BGM suno**

## 🎮 ページ構成

| ページ名          | 説明 |
|------------------|------|
| `/`              | ランディング（世界観紹介、スタートボタン） |
| `/game`          | ブラックジャックゲーム本編（音・演出付き） |
| `/review`        | C言語版コードとTypeScript版を比較・講評 |

## 📦 セットアップ

```bash
npm install
npm run dev
```

## 👨‍🏫 制作・監修

川田強火担

---

🗓️ 最終更新日：2025-08-15
