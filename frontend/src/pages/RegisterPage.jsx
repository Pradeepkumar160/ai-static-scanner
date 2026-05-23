import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [msg,   setMsg]   = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    try {
      await api.post("/auth/register", { email, password: pass });
      setMsg("Registered! Redirecting...");
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
        {msg && <p className="text-cyan-400 text-sm mb-4">{msg}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full bg-slate-700 rounded px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-slate-700 rounded px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded transition">Register</button>
        </form>
        <p className="text-slate-400 text-sm mt-4 text-center">
          Have an account? <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
