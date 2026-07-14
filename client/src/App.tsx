import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app">
      <nav className="app__nav">
        <Link to="/products" className="app__brand">
          Product Catalog
        </Link>
        {isAuthenticated ? (
          <div className="app__nav-user">
            <span>{user?.username}</span>
            <button onClick={logout}>Log out</button>
          </div>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </nav>
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  );
}
