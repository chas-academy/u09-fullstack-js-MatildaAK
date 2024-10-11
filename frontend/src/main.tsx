import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import CoffeePage from "./pages/CoffeePage/CoffeePage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import Cart from "./pages/Cart/Cart.tsx";
import Product from "./pages/ProductPage/Product.tsx";
import Login from "./pages/LoginPage/Login.tsx";
import Category from "./pages/CategoryPage/Category.tsx";
import bannergarden from "./assets/images/bannergarden.svg";
import bannerbook from "./assets/images/bannerbooks.svg";
import Register from "./pages/RegisterPage/Register.tsx";
import { AuthProvider, useAuth } from "./components/Auth/Auth.tsx";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, token } = useAuth();

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  if (isAuthenticated) {
    return element;
  }
  if (token !== null) {
    return element;
  }

  return <Navigate to="/login" />;
};


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
        path: "tradgard/:id",
        element: <Product />,
      },
      {
        path: "tradgard",
        element: <Category category="garden" banner={bannergarden} />,
      },
      {
        path: "bocker",
        element: <Category category="book" banner={bannerbook} />,
      },
      {
        path: "bocker/:id",
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
  <AuthProvider>
      <RouterProvider router={router} />
  </AuthProvider>

);
