import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <div>
        <Header />

        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
