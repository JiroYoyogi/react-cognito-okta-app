// pages/CallbackLogint.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

// code → token
// URLについたクエリを削除したい。トップページへリダイレクト
const CallbackLogin = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Encountering error... {auth.error.message}</div>;

  return null;
};

export default CallbackLogin;
