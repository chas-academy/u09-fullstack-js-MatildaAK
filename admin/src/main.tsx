import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from './pages/Admin/Admin.tsx';
import AddProduct from './components/Products/AddProduct/AddProduct.tsx';
import ListProduct from './components/Products/ListProduct/ListProduct.tsx';

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
        element: <Admin />,
      },
      {
        path: "/skapa",
        element: <AddProduct />
      },
      {
        path: "/produkter",
        element: <ListProduct />
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
