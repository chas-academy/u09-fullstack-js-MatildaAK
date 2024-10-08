import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { useAuth } from "./components/Auth/Auth";
// import Admin from "./pages/Admin/Admin";

function App() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogin = (identifier: string, userId: string, token: string) => {
    login(identifier, userId, token);
    navigate("/admin");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <main>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {/* <Admin /> */}
      <Outlet
        context={{
          onLogin: handleLogin,
        }}
      />
    </main>
  );
}

export default App;
