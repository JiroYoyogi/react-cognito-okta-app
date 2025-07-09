# 作業手順

1. Cognito・ユーザープール作成
2. Okta・新しいアプリ統合を作成
3. Connito・アイデンティティプロバイダーを追加
4. ログイン出来るかテスト
5. ユーザー名をトークンに入れる・Lambdaトリガー作成
6. OAuth 付与タイプを変更
7. Reactにログイン機能を実装（Cognitoにあるサンプル）

# Cognito・ユーザープール作成

- アプリケーションタイプ
  - シングルページアプリケーション(SPA)
- アプリケーションに名前を付ける
  - My SPA app
- サインイン識別子オプション
  - メールアドレス
- サインアップのための必須属性
  - email

上記作成後に「概要」→「名前変更」

- User pool with Okta

# Okta・新しいアプリ統合を作成

- アプリ名
  - Cognito SAML
- シングルサインオンURL
  - 自分のCognitoドメイン/saml2/idpresponse
  - 例: `https://ap-northeast-1zpzvpl7q4.auth.ap-northeast-1.amazoncognito.com/saml2/idpresponse`
- オーディエンスURI（SPエンティティID）
  - urn:amazon:cognito:sp:ユーザープール ID
  - 例: `urn:amazon:cognito:sp:ap-northeast-1_ZpzVPl7Q4`
- 属性ステートメント（オプション）
  - email: user.email
  - displayname: user.displayName

# Connito・アイデンティティプロバイダーを追加

- プロバイダー名
  - Okta
- プロバイダーとユーザープールの間で属性をマッピング
  - email: email
  - name: displayname

プリケーションクライアント → ログインページ

- 許可されているコールバック URL
  - https://jwt.io/ja
- ID プロバイダー
  - "Okta"を追加
- OAuth 2.0 許可タイプ
  - "認可コード付与"を削除 ❎
  - "暗黙的な付与"を追加 ✅

# ユーザー名をトークンに入れる・Lambdaトリガー作成

トークンに任意の属性を含めたい

- トリガータイプ: 認証
- サインアップ: トークン生成前トリガー
- Lambda関数の作成
- 関数名: cognito-token-customizer
- ランタイム: Node.js 22.x
- 実行ロール: 基本的な Lambda アクセス権限で新しいロールを作成

```js
export const handler = async (event) => {
  // userAttributes から必要な属性をトークンに追加
  const attrs = event.request.userAttributes;

  event.response = {
    claimsAndScopeOverrideDetails: {
      idTokenGeneration: {
        claimsToAddOrOverride: {
          name: attrs.name,
          email: attrs.email
        },
      }
    }
  };

  return event;
};
```

# OAuth 付与タイプを変更

PKCE検証無しでトークンを受け取れてしまう状態を修正

- "暗黙的な付与"を削除 ❎
- "認証コード付与"を追加 ✅

# Reactにログイン機能を実装（Cognitoにあるサンプル）

Cognitoに記載されているReact用のサンプルコードを実装（2025.7月現在記載のもの）

## Reactアプリ作成

```
npm create vite@latest
```

## ライブラリインストール

```
npm install oidc-client-ts react-oidc-context --save
```

## コード変更

- main.tsx

```js
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-northeast-1.amazonaws.com/{ユーザープール ID}",
  client_id: "{アプリケーションクライアントID}",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

- App.tsx

```js
// App.tsx

import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "{アプリケーションクライアントID}";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "{Cognito ドメイン}";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}

export default App;
```