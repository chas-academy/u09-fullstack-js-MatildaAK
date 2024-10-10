import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { useAuth } from "./components/Auth/Auth";
import Admin from "./pages/Admin/Admin";

function App() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogin = (identifier: string, userId: string, token: string) => {
    login(identifier, userId, token);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <main>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div>
          <Admin />
        </div>
        <div className="lg:flex-grow lg:ml-4">
          <Outlet
            context={{
              onLogin: handleLogin,
            }}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
