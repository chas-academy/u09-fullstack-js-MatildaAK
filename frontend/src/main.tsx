import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoffeePage from "./pages/CoffeePage/CoffeePage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import Cart from "./pages/Cart/Cart.tsx";
import Product from "./pages/ProductPage/Product.tsx";
import Login from "./pages/LoginPage/Login.tsx";
import Category from "./pages/CategoryPage/Category.tsx";


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
        path: "cafe",
        element: <CoffeePage />,
      },
      {
        path: "garden",
        element: <Category />,
      },
      {
        path: "book",
        element: <Category />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "product",
        element: <Product />,
      }, 
      {
        path: "product:productId",
        element: <Product />,
      }, 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
