import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
// import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <main>
      <Header />
      {/* <Admin /> */}
      <Outlet />
    </main>
  );
}

export default App;
