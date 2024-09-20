import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";

function App() {
  return (
    <>
      <div>
        <Header />

        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
