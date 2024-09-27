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
import bannergarden from "./assets/images/bannergarden.svg";
import bannerbook from "./assets/images/bannerbooks.svg";
import ShopContextProvider from "./Context/ShopContext.tsx";
import Register from "./pages/RegisterPage/Register.tsx";


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
        path: "garden/product/:id",
        element: <Product />,
      },
      {
        path: "garden",
        element: <Category category="garden" banner={bannergarden} />,
      },
      {
        path: "book",
        element: <Category category="book" banner={bannerbook} />,
      },
      {
        path: "book/product/:id",
        element: <Product />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "cart",
        element: <Cart />,
      }, 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ShopContextProvider>
      <RouterProvider router={router} />
  </ShopContextProvider>

);
