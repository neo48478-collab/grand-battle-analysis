# グランドバトル用戦力分析

JPサーバーのグループ、4ワールド、ギルド戦力ランキング、ギルド内メンバー戦力を確認するモバイル向けWebアプリです。レジェンドリーグ編成は、取得できたプレイヤーについて5体のチップで表示します。

## 起動

```bash
npm install
npm run dev
```

本番ビルドは `npm run build` です。デスクトップの「グランドバトル用戦力分析（ローカル）」ショートカットからも起動できます。

## 実データ取得

`collector/index.mjs` が、運営確認済みの上流APIから次のデータを取得します。

- グループ・ワールド対応: `wgroups` / `worlds`
- ギルド戦力: `{worldId}/guild_ranking/latest`
- メンバー戦力: `{worldId}/player_ranking/latest`
- レジェンドリーグ編成: 元システムが参照する公開CSV

ローカルで実行する場合:

```powershell
$env:MM_UPSTREAM_API_BASE = 'https://api.mentemori.icu'
$env:MM_LEGEND_LEAGUE_CSV_URL = 'https://docs.google.com/spreadsheets/d/15bxBeoWfO4R1b1u5OlohpwCsZLmWEUOaXwrsT9h0eYg/export?format=csv&gid=0'
$env:MM_REGION = 'jp'
npm run collect
npm run build
```

取得結果は `public/data/latest.json` に保存され、画面はこのスナップショットだけを読み込みます。APIの認証情報はブラウザーへ渡しません。

## 自動更新

`.github/workflows/update-upstream-data.yml` が毎時、日本時間の00分に実行され、最新スナップショットをコミットします。GitHub Pagesのデプロイは `deploy-pages.yml` が担当します。

## Android版

Android版は Capacitor で構成しています。画面はAPK内に同梱し、起動時に公開中の `data/latest.json` を取得するため、Web版と同じ毎時更新データを表示します。通信できない場合は、APK内に同梱した直近データを表示します。

```bash
npm run android:sync
npm run android:open
```

GitHub Actionsの `Build Android APK` は、Android関連の変更が `main` に反映されたときにデバッグAPKを生成します。成果物名は `grand-battle-analysis-android` です。
