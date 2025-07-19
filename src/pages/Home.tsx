// Home.js
import { useAuth } from "react-oidc-context";
import {
  cognitoClientId,
  cognitoDomain,
  appDomain
} from "../authConfig";
import { useState } from "react";

function Home() {
  const [ isLoggingOut, setIsLoogingOut ] = useState(false);
  const auth = useAuth();
  const signOutRedirect = () => {
    setIsLoogingOut(true);
    auth.removeUser(); // sessionストレージをクリア
    window.location.href = `${cognitoDomain}/logout?client_id=${cognitoClientId}&logout_uri=${encodeURIComponent(
      `${appDomain}/callback-logout/`
    )}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (isLoggingOut) {
    return <div>Logging out...</div>;
  }

  return (
    <main>
      {auth.isAuthenticated ? (
        <>
          <p>こんにちは、{auth.user?.profile.name}さん</p>
          <dl>
            <dt>ID Token</dt>
            <dd>
              <pre>{auth.user?.id_token}</pre>
            </dd>
            <dt>Access Token</dt>
            <dd>
              <pre>{auth.user?.access_token}</pre>
            </dd>
          </dl>
          <button onClick={() => signOutRedirect()}>ログアウト</button>
        </>
      ) : (
        <>
          <p>こんにちは、ゲストさん</p>
          <button onClick={() => auth.signinRedirect()}>ログイン</button>
        </>
      )}
    </main>
  );
}

export default Home;
