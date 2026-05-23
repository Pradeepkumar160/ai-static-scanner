import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ScanPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const nav = useNavigate();

  const startScan = async () => {
    if (!repoUrl.trim()) { setError("Please enter a repository URL"); return; }
    setLoading(true); setError("");
    try {
      const res = await api.post("/scan", { repo_url: repoUrl });
      nav("/results/" + res.data.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to start scan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold text-white mb-2">New Scan</h1>
      <p className="text-slate-400 mb-8">Enter a public GitHub repository URL.</p>
      {error && <div className="bg-red-900/40 border border-red-500 rounded p-3 text-red-300 text-sm mb-4">{error}</div>}
      <div className="bg-slate-800 rounded-xl p-6 space-y-4">
        <input
          className="w-full bg-slate-700 rounded px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="https://github.com/owner/repo"
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && startScan()}
        />
        <button
          onClick={startScan}
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? "Queuing scan..." : "Start Scan"}
        </button>
      </div>
    </div>
  );
}
