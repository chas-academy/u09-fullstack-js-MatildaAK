import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoffeePage from "./pages/CoffeePage/CoffeePage.tsx";
import GardenPage from "./pages/GardenPage/GardenPage.tsx";
import BookPage from "./pages/BookPage/BookPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";

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
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/cafe",
        element: <CoffeePage />,
      },
      {
        path: "/garden",
        element: <GardenPage />,
      },
      {
        path: "/book",
        element: <BookPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
