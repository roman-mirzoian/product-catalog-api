import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "./App";
import { ProductsPage } from "./pages/ProductsPage";
import { LoginPage } from "./pages/LoginPage";
import { RequireAuth } from "./components/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      {
        path: "products",
        element: (
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        ),
      },
      { path: "login", element: <LoginPage /> },
    ],
  },
]);
