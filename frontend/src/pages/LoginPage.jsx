import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError("");
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", pass);
      const res = await api.post("/auth/login", form,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      login(res.data.access_token);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full bg-slate-700 rounded px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-slate-700 rounded px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded transition">Login</button>
        </form>
        <p className="text-slate-400 text-sm mt-4 text-center">
          No account? <Link to="/register" className="text-cyan-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
