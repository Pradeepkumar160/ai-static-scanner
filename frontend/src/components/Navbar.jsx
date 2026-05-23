import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, logout } = useAuth();
  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-cyan-400 font-bold text-lg">shield AI Scanner</Link>
      <div className="flex gap-4 text-sm">
        {isAuth ? (
          <>
            <Link to="/"     className="text-slate-300 hover:text-white">Dashboard</Link>
            <Link to="/scan" className="text-slate-300 hover:text-white">New Scan</Link>
            <button onClick={logout} className="text-red-400 hover:text-red-300">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="text-slate-300 hover:text-white">Login</Link>
            <Link to="/register" className="text-slate-300 hover:text-white">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
