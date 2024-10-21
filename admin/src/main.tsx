import { createRoot } from 'react-dom/client'
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
// import Admin from './pages/Admin/Admin.tsx';
import AddProduct from './components/Products/AddProduct/AddProduct.tsx';
import ListProduct from './components/Products/ListProduct/ListProduct.tsx';
import Login from './pages/Login/Login.tsx';
import { AuthProvider, useAuth } from './components/Auth/Auth.tsx';
import CreateUser from './components/User/CreateUser/CreateUser.tsx';
import UserList from './components/User/UserList/UserList.tsx';

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
        path: "/login",
        element: <Login />,
      },
      // {
      //   path: "/admin",
      //   element: <ProtectedRoute element={<Admin />} />,
      // },
      {
        path: "/skapa",
        element: <ProtectedRoute element={<AddProduct />} />,
      },
      {
        path: "/produkter",
        element: <ProtectedRoute element={<ListProduct />} />,
      },  
      {
        path: "/anvandare",
        element: <ProtectedRoute element={<CreateUser />} />,
      },
      {
        path: "/anvandare/alla",
        element: <ProtectedRoute element={<UserList />} />,
      }, 
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
)

