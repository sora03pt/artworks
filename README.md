# ARTWORKS

絵画教室で制作した作品を画像中心で展示する個人用ギャラリーです。Next.js App Router、TypeScript、Tailwind CSSを使用し、`next build`で静的サイトを出力します。データベースやCMSは不要です。

## 起動

```bash
npm install
npm run dev
```

`http://127.0.0.1:3000` を開いてください。公開用の静的ファイルは `npm run build` 後に `out/` に生成されます。

## 作品を追加する

1. 作品画像（WebP推奨）を `public/artworks/` に置きます。
2. 画像の実寸の幅・高さを確認します。
3. `src/data/gallery.ts` の `galleryItems` に `type: "artwork"` の項目を追加します。`image` は `/artworks/ファイル名`、`width` と `height` は画像の実寸を指定します。

`width` と `height` は画像の実寸です。表示枠は全作品で同じ3:4とし、画像は切り抜かず枠内に収めます。現在の4枚は提供された作品写真をWebPに変換したものです。元のJPEGも同じフォルダに残しています。作品名と説明文は仮の表記で、制作年と画材は未登録です。正式な情報が分かれば同じ配列の項目を書き換えてください。

## 見出しパネルを追加する

同じ `galleryItems` 配列に `type: "heading"` の項目を追加できます。`backgroundColor`、`textColor`、`aspectRatio`（幅 ÷ 高さ）を指定します。現在は顔と素描、図形の2つの見出しがあり、それぞれ次の見出しまでの作品をまとめます。配列内の位置が一覧とポップアップの読み順になります。

## GitHub Pages

リポジトリの Pages 公開元は GitHub Actions に設定済みです。`main` への反映後、`.github/workflows/pages.yml` が静的ファイルをビルドして公開します。公開先は `https://sora03pt.github.io/artworks/` です。

GitHub Pages 用ビルドでは `NEXT_PUBLIC_BASE_PATH=/artworks` を指定し、Next.js のアセットと作品画像の参照先を揃えます。ローカルの `npm run dev` では指定不要です。

## 確認

```bash
npm run lint
npm run typecheck
npm run build
```
