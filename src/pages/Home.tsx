// Home.js
import { useAuth } from "react-oidc-context";
import { cognitoClientId, cognitoDomain, appDomain } from "../authConfig";

function Home() {
  const auth = useAuth();

  const signOutRedirect = () => {
    auth.removeUser(); // sessionストレージをクリア
    window.location.href = `${cognitoDomain}/logout?client_id=${cognitoClientId}&logout_uri=${encodeURIComponent(
      `${appDomain}/`
    )}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <main>
      {auth.isAuthenticated ? (
        <>
          <p>ログイン中</p>
          {auth.user?.profile.name ? (
            <p>こんにちは、{auth.user?.profile.name}</p>
          ) : (
            <p>{auth.user?.profile.email}</p>
          )}
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
