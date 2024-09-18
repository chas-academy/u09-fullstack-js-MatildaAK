import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage.tsx";
import CoffeePage from "./pages/CoffeePage/CoffeePage.tsx";
import GardenPage from "./pages/GardenPage/GardenPage.tsx";
import BookPage from "./pages/BookPage/BookPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <App />
      </>
    ),
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/Cafe",
        element: <CoffeePage />,
      },
      {
        path: "/Garden",
        element: <GardenPage />,
      },
      {
        path: "/Book",
        element: <BookPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
