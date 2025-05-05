# Doggy Buddy - Tailwind CSS 設計ガイドライン

このドキュメントは Doggy Buddy アプリケーションの UI 開発において、一貫性のあるデザインを維持するための Tailwind CSS ガイドラインです。

## カラースキーム

### メインカラー
- **緑系**:
  - ベース: `text-green-600`, `bg-green-600`, `border-green-600`
  - ホバー/強調: `text-green-700`, `bg-green-700`, `hover:bg-green-700`
  - 薄い背景: `bg-green-50`, `bg-green-100`

### テキストカラー
- 主要テキスト: `text-gray-900`
- 二次テキスト: `text-gray-600`, `text-gray-700`
- 補足テキスト: `text-gray-500`
- リンク: `text-green-600`, `hover:text-green-700`

### システムカラー
- エラー: `text-red-700`, `bg-red-100`, `border-red-500`
- 成功: `text-green-700`, `bg-green-100`, `border-green-500`

## スペーシング

### マージン
- 小: `my-2`, `mx-2` (0.5rem, 8px)
- 中: `my-4`, `mx-4` (1rem, 16px)
- 大: `my-6`, `mx-6` (1.5rem, 24px)
- 特大: `my-8`, `mx-8` (2rem, 32px)
- セクション間: `mt-12`, `mb-12` (3rem, 48px)

### パディング
- ボタン: `py-2 px-4` (垂直: 0.5rem, 水平: 1rem)
- カード: `p-5` または `p-6` (1.25rem/1.5rem)
- セクション: `py-16 px-4` (垂直: 4rem, 水平: 1rem)

## コンテナ幅
- 最大幅: `max-w-7xl` (80rem, 1280px)
- カード: `max-w-lg` (32rem, 512px)
- フォーム: `max-w-md` (28rem, 448px)

## レスポンシブデザイン

モバイルファースト設計を採用しています。以下のブレークポイントを使用します:

- `sm`: 640px以上
- `md`: 768px以上
- `lg`: 1024px以上
- `xl`: 1280px以上

## タイポグラフィ

### フォントサイズ
- 小さいテキスト: `text-sm` (0.875rem, 14px)
- 通常テキスト: `text-base` (1rem, 16px)
- 中見出し: `text-lg` (1.125rem, 18px)
- 見出し: `text-xl` または `text-2xl` (1.25rem/1.5rem, 20px/24px)
- 大見出し: `text-3xl` または `text-4xl` (1.875rem/2.25rem, 30px/36px)

### フォントウェイト
- 通常: `font-normal`
- 中太: `font-medium`
- 太字: `font-bold`
- 特太: `font-extrabold` (見出しなど)

## UI要素

### ボタン

#### プライマリーボタン
```html
class="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
セカンダリーボタン
htmlclass="px-4 py-2 bg-white text-green-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
テキストボタン/リンク
htmlclass="text-green-600 hover:text-green-700"
カード
htmlclass="bg-white rounded-lg shadow-sm overflow-hidden"
フォーム要素
入力フィールド
htmlclass="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
ラベル
htmlclass="block text-sm font-medium text-gray-700"
ヘルプテキスト
htmlclass="mt-2 text-sm text-gray-500"
エラーメッセージ
htmlclass="mt-2 text-sm text-red-600"
その他の仕様
角丸

小: rounded (0.25rem, 4px)
中: rounded-md (0.375rem, 6px)
大: rounded-lg (0.5rem, 8px)
完全な丸: rounded-full

シャドウ

小: shadow-sm
中: shadow
大: shadow-lg

境界線

通常: border border-gray-300
カラー付き: border border-green-500
太さ変更: border-2

アニメーション/トランジション

通常: transition
ホバーでの色変更: transition-colors duration-200

Z-index

ドロップダウンメニュー: z-10
モーダル: z-50
最前面: z-100

コンポーネント例
アラート・通知
成功メッセージ
html<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
  <p>操作が成功しました</p>
</div>
エラーメッセージ
html<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
  <p>エラーが発生しました</p>
</div>
アバター
ユーザーアバター (小)
html<span class="inline-block h-8 w-8 rounded-full overflow-hidden bg-green-100">
  <!-- アバター画像またはデフォルトアイコン -->
</span>
ユーザーアバター (中)
html<span class="inline-block h-10 w-10 rounded-full overflow-hidden bg-green-100">
  <!-- アバター画像またはデフォルトアイコン -->
</span>
バッジ
ステータスバッジ
html<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  活動中
</span>
ページ構成要素
ヘッダー

ロゴ、ナビゲーション、ユーザーメニューを含む
モバイル対応のハンバーガーメニュー

フッター

サービス情報、サポート、会社情報のセクション
SNSリンク
コピーライト表示

トップページのセクション

ヒーローセクション: アプリ概要と主要CTAボタン
サービスの特徴: 3つの特徴カード
利用の流れ: 3ステップで説明
CTA: 会員登録促進

今後追加予定のセクション

人気のシッター: 評価の高いシッターの紹介
お客様の声: 利用者のレビュー

ベストプラクティス

モバイルファースト設計を心がける
一貫したスペーシングとカラーを使用する
アクセシビリティに配慮する（適切なコントラスト、フォーカス状態など）
Tailwindのユーティリティクラスを組み合わせてコンポーネントのスタイルを構築する
繰り返し使用するコンポーネントはパーシャルとして抽出する


このガイドラインは開発の進行に伴い更新されます。最新版を参照してください。
最終更新: 2025年5月5日