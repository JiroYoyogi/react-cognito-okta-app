# 作業手順

1. アプリケーション（React）をDL
2. 変数設定・初期状態を確認
3. ログインコールバックを作成
4. Oktaでもログアウトする方法
5. Oktaでもログアウト・パターン１
6. Oktaでもログアウト・パターン２
7. 有効期限切れトークンを更新（おまけ）

# 前提

CognitoとOktaのSAML連携済み。まだの方は下記を参考に連携を済ませて下さい。

- [【動画版】CognitoをOktaとSAML連携するハンズオン](https://youtu.be/LDrlnx3Scaw?si=YxspMmV5BneKcFq6)
- [【Qiita版】CognitoをOktaとSAML連携するハンズオン](https://qiita.com/kenny_g/items/074b1cc4653ab0be7e43)

また、アプリケーションクライアントの設定が下記のようになってることも確認して下さい。

- 許可されているコールバック URL
  - http://localhost:5173/
- 許可されているサインアウト URL
  - http://localhost:5173/

# 環境

リポジトリ作成時の環境は以下です。

- Node.js
  - v22.14.0

# 1. アプリケーション（React）をDL

ブランチが「react」であることを確認した上で、右上「Code」よりDL

# 2. 変数設定・初期状態を確認

## 変数設定

下記4つの変数を設定する。

（src/authConfig.ts）

- cognitoDomain
  - Cognitoドメイン
  - e.g. `https://ap-northeast-1ga5zacsn4.auth.ap-northeast-1.amazoncognito.com`
- cognitoUserPoolId
  - ユーザープール ID
  - e.g. `ap-northeast-1_Ga5ZacSN4`
- cognitoClientId
  - アプリケーションクライアントID
  - e.g. `2hoqf7stavskccjltmtpm93hsq`
- oktaDomain
  - ご自身のOktaドメイン
  - e.g. `https://trial-12345.okta.com`

## 初期状態を確認

### 許可されているコールバック・サインアウトURLを確認（AWSマネコン）

- 許可されているコールバック URL
  - http://localhost:5173/
- 許可されているサインアウト URL
  - http://localhost:5173/

### React関連のライブラリインストール

```
npm install
```

### ログイン関連のライブラリインストール

スキップして大丈夫です。上記でインストール済みです。

```
npm install oidc-client-ts react-oidc-context --save
```

### アプリ起動

```
npm run dev
```

# 3. ログインコールバックを作成

- authConfig.ts

redirect_uriを変更する。

```js
export const cognitoConfig = {
  authority: `https://cognito-idp.ap-northeast-1.amazonaws.com/${cognitoUserPoolId}`,
  client_id: cognitoClientId,
  redirect_uri: `${appDomain}/callback-login/`, // ⭐️
  response_type: "code",
  scope: "email openid phone",
};
```

- AWSマネコンで「許可されているコールバック URL」を変更する

```
http://localhost:5173/callback-login/
```

# 4. Oktaでもログアウトする方法

- CORS許可パターン（S3でもいける）・パターン１
  - Cognitoログアウトエンドポイントへアクセス → Oktaログアウトエンドポイントへアクセス
- POST受信エンドポイントパターン（サーバーが必要）・パターン２
  - Cognitoログアウトエンドポイントのみアクセス（CognitoとOktaのログアウト連携）

# 5. Oktaでもログアウト・パターン１

## コード変更

- Home.tsx

```js
  const signOutRedirect = () => {
    auth.removeUser(); // sessionストレージをクリア
    window.location.href = `${cognitoDomain}/logout?client_id=${cognitoClientId}&logout_uri=${encodeURIComponent(
      `${appDomain}/callback-logout/`
    )}`;
  };
```

## AWSマネコンでサインアウトURLを変更

許可されているサインアウト URLを下記に変更（AWSマネコン）

```
http://localhost:5173/callback-logout/
```

## Oktaでアプリへのリダイレクトを許可

セキュリテイ→API→信頼済みオリジン

- オリジン名
  - ローカルホスト
- オリジンの​URL 
  - http://localhost:5173/
- タイプを​選択
  - リダイレクト

# 6. Oktaでもログアウト・パターン２

## 手順

- ソーシャルプロバイダーと外部プロバイダーの設定変更
- 署名証明書をDL・Oktaにアップロード
- Expressで「SAML LogoutRequest」をキャッチする

## ソーシャルプロバイダーと外部プロバイダーの設定変更

下記にチェックを入れる

- サインアウトフローを追加
- このプロバイダーへの SAML リクエストに署名する

## 署名証明書をDL・Oktaにアップロード

### AWS

署名証明書を.crtとしてダウンロード

### Okta

- 名前IDの​フォーマット
  - Persistent
- 署名証明書
  - .crtファイルをアップロード
- シングルログアウトを​有効化
  - アプリケーションに​よる​シングルログアウトの​開始を​許可
- シングルログアウトURL 
  - http://localhost:3000/api/logout-complete
- SP発行者
  - オーディエンスURIと同じ値
- 署名付きリクエスト
  - 署名証明書を​使用して​SAMLリクエストを​検証します。

## Expressで「SAML LogoutRequest」をキャッチする

### Expressをインストール

```
npm i express@5.1.0
```

### ExpressとReactを同時起動するライブラリ追加

```
npm i concurrently
```

### コマンドを追加

- package.json

```
  "scripts": {
    "dev": "vite",
    "server": "node server.js",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "dev:full": "concurrently \"npm run dev\" \"npm run server\""
  },
```

### logout_uriを削除

- Home.tsx

signOutRedirectを下記と置き換える。

```tsx
  const signOutRedirect = () => {
    auth.removeUser(); // sessionストレージをクリア
    window.location.href = `${cognitoDomain}/logout?client_id=${cognitoClientId}`;
  };
```

# 7. 有効期限切れトークンを更新（おまけ）

（Home.tsx）

- useEffectをインポート

```ts
import { useEffect } from "react";
```

- useEffectを作成

```ts
  // トークン更新と残り時間のチェック
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user || auth.isLoading) return;

    const expiresAt = auth.user.expires_at ?? 60 * 60;
    console.log(expiresAt);

    const updateTimeLeftAndRefresh = () => {
      const expiresIn = expiresAt * 1000 - Date.now();
      if (expiresIn < 3 * 60 * 1000) {
        auth.signinSilent().catch(() => {
          auth.signinRedirect();
        });
      }
    };

    // 1分ごとに残り時間を更新
    const intervalId = setInterval(updateTimeLeftAndRefresh, 60 * 1000);

    // 初回実行
    updateTimeLeftAndRefresh();

    return () => clearInterval(intervalId);
  }, [auth]);
```

- トークンの有効期限を表示

```html
  <dt>トークンの有効期限</dt>
  <dd>
    {formatTime(auth.user?.expires_at as number)}
  </dd>
```

- フォーマット関数

```jsx
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      hour12: false, // 24時間表記
    });
  };
```

- Loadingの条件文を変更

```jsx
  if (auth.isLoading && !auth.user) {
    return <div>Loading...</div>;
  }
```