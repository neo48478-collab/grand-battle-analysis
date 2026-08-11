# Guild Signal

ワールドを選ぶと紐づくグループと4ワールドを表示し、そこからギルド → メンバーを探せる、モバイル優先のUIプロトタイプです。

## データソースの境界

このUIのデモデータは、実データや下流APIのコピーではありません。`src/main.jsx` の `demoGroups` は表示確認用の合成データです。

調査した「一番元」のデータ経路は、公式ゲーム側の認証済みセッションを使うAPIでした。ギルド／メンバー情報は公開・未認証の静的データではないため、ブラウザにゲームの認証情報を埋め込まず、次の構成で接続する前提です。

```text
公式ゲームAPI（認証済み・読み取り専用）
              ↓
      サーバー側コレクター（1時間ごと）
              ↓
     このUIが読む公開JSON/API
```

認証方法と利用許諾が確認できた段階で、`demoGroups` を `upstreamAdapter` の取得結果に置き換えます。Google Sheet や `api.mentemori.icu` はこのプロトタイプから参照していません。

## 起動

```bash
npm install
npm run dev
```

本番ビルドは `npm run build` です。

## ローカルで見る

デスクトップに作成した「グランドバトル用戦力分析（ローカル）」ショートカットを開くと、開発サーバーを起動してブラウザで表示します。手動で起動する場合は `npm run dev` を実行してください。

## 実データ接続

実データはブラウザから直接取得せず、`collector/index.mjs` が運営確認済みの上流JSONエンドポイントから読み取り、`public/data/latest.json` を上書きします。画面はこの最新JSONを読み込みます。エンドポイントやトークンはソースコードに保存しません。

必要な環境変数は `.env.example` にあります。

```bash
$env:MM_AUTHORIZED_UPSTREAM_URL = 'https://operator-approved-endpoint.example/data.json'
$env:MM_UPSTREAM_BEARER_TOKEN = 'operator-approved-token'
npm run collect
npm run build
```

GitHub Actions の `.github/workflows/update-upstream-data.yml` は、日本時間の毎時00分に実行する設定です。GitHub Secrets に `MM_AUTHORIZED_UPSTREAM_URL` と、必要な場合だけ `MM_UPSTREAM_BEARER_TOKEN` を登録してください。保存するのは常に最新スナップショット1つだけです。

コレクターが受け取るJSONは、次の形にします。

```json
{
  "groups": [
    {
      "id": "group-id",
      "label": "グループ 181",
      "worlds": [
        {
          "id": "world-id",
          "label": "W165",
          "guilds": []
        }
      ]
    }
  ]
}
```
