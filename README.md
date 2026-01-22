# 🎉 Digital Meibo - デジタル名簿アプリ

チームラボ社内飲み会用のモダンなデジタル名簿アプリケーションです。

![Screenshot](https://via.placeholder.com/800x400?text=Digital+Meibo+Screenshot)

## ✨ 機能

- **16名分のプロフィールグリッド表示** - 名前と一言が並ぶモダンなカードレイアウト
- **詳細モーダル** - タップで詳細情報（名前、役割、Now、Topic、Core）を表示
- **ナビゲーション** - モーダル内で左右ボタン/キーボード/スワイプで前後移動
- **スケルトンローディング** - データ読み込み中のグロー演出
- **Glassmorphism UI** - チームラボらしいモダンでダークなデザイン

## 🛠️ 技術スタック

| 技術 | バージョン |
|------|-----------|
| Vite | 7.3.1 |
| React | 19.2.0 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.1.18 |
| Framer Motion | 12.27.5 |
| Lucide React | 0.562.0 |

## 🚀 セットアップ

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── index.ts          # コンポーネントエクスポート
│   ├── ProfileCard.tsx   # プロフィールカード
│   ├── DetailModal.tsx   # 詳細モーダル
│   └── SkeletonCard.tsx  # スケルトンローディング
├── hooks/
│   ├── index.ts          # フックエクスポート
│   └── useProfiles.ts    # プロフィール取得フック
├── types/
│   └── index.ts          # 型定義
├── constants/
│   └── index.ts          # 定数・モックデータ
├── App.tsx               # メインアプリ
├── main.tsx              # エントリーポイント
└── index.css             # グローバルスタイル
```

## 🔧 GAS API 設定

実際のデータを使用する場合は、`src/constants/index.ts` の `GAS_API_URL` を更新してください：

```typescript
export const GAS_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

### API レスポンス形式

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "田中 太郎",
      "role": "フロントエンドエンジニア",
      "hitokoto": "技術で世界を変えたい",
      "now": "Next.js 15のApp Routerを使った新規プロジェクト開発",
      "topic": "最近AI画像生成にハマっています",
      "core": "「常に学び続ける」- 変化を恐れず、新しいことに挑戦し続ける"
    }
  ]
}
```

## 🌐 GitHub Pages デプロイ

### 自動デプロイ（推奨）

1. リポジトリの Settings > Pages で Source を "GitHub Actions" に設定
2. `main` ブランチにプッシュすると自動的にデプロイされます

### 手動デプロイ

```bash
npm run deploy
```

### base URL の変更

リポジトリ名が異なる場合は、`vite.config.ts` の `base` を変更してください：

```typescript
export default defineConfig({
  // ...
  base: '/your-repo-name/',
})
```

## 🎨 デザイン特徴

- **Glassmorphism** - 半透明のガラス質感を持つUI
- **グラデーションアクセント** - シアン・パープル・ピンクのグラデーション
- **アニメーション** - Framer Motionによるスムーズなトランジション
- **レスポンシブ** - モバイル〜デスクトップ対応のグリッドレイアウト
- **パーティクル背景** - 浮遊する光の粒子エフェクト

## 📱 操作方法

### デスクトップ
- カードクリック → 詳細モーダル表示
- `←` / `→` キー → 前後のプロフィール
- `Esc` キー → モーダルを閉じる

### モバイル
- カードタップ → 詳細モーダル表示
- 左右スワイプ → 前後のプロフィール
- × ボタン → モーダルを閉じる

## 📄 ライセンス

MIT License

---

Made with 💜 for teamLab
