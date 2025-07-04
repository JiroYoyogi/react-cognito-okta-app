import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CallbackLogin from './pages/CallbackLogin';
import CallbackLogout from "./pages/CallbackLogout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback-login" element={<CallbackLogin />} />
        <Route path="/callback-logout" element={<CallbackLogout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;