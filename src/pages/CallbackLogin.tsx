// pages/CallbackLogint.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

// 作らないとURLにコードがくっついたままになる！！
const CallbackLogin = () => {
  const oidc = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!oidc.isLoading && oidc.isAuthenticated) {
      navigate('/');
    }
  }, [oidc.isLoading, oidc.isAuthenticated, navigate]);
  if (oidc.isLoading) return <div>Loading...</div>;
  if (oidc.error) return <div>Encountering error... {oidc.error.message}</div>;

  return null;
};

export default CallbackLogin;
