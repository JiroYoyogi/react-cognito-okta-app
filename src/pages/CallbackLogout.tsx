// pages/CallbackLogout.tsx
import { useEffect } from "react";
import { oktaDomain, appDomain } from "../authConfig";

// Oktaでしっかりログアウトしたい！！
// これをしないとOktaとのログインセッションは残ったままになる！！
const CallbackLogout = () => {
  useEffect(() => {
    // 👇 OktaのログアウトURLへリダイレクト
    const oktaLogoutUrl = `${oktaDomain}/login/signout?fromURI=${encodeURIComponent(appDomain)}`;
    window.location.href = oktaLogoutUrl;
  }, []);

  return <div>Logging out...</div>;
};

export default CallbackLogout;
