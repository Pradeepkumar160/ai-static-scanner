import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const STATUS_BADGE = {
  completed: "bg-green-700 text-green-100",
  running:   "bg-blue-700 text-blue-100",
  queued:    "bg-yellow-700 text-yellow-100",
  failed:    "bg-red-700 text-red-100",
};

export default function DashboardPage() {
  const [scans,   setScans]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await api.get("/scan"); setScans(res.data); }
      catch { setScans([]); }
      finally { setLoading(false); }
    };
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Link to="/scan" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition">+ New Scan</Link>
      </div>
      {loading && <p className="text-slate-400">Loading...</p>}
      {!loading && scans.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-4">No scans yet.</p>
          <Link to="/scan" className="text-cyan-400 hover:underline">Start your first scan</Link>
        </div>
      )}
      {scans.map(s => (
        <Link to={"/results/" + s.id} key={s.id}
          className="block bg-slate-800 hover:border-cyan-500 border border-slate-700 rounded-xl p-5 mb-4 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold truncate max-w-sm">{s.repo_url}</p>
              <p className="text-slate-500 text-xs mt-1">{new Date(s.created_at).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className={"text-xs px-2 py-1 rounded font-bold " + (STATUS_BADGE[s.status] || "bg-slate-600")}>
                {s.status.toUpperCase()}
              </span>
              {s.status === "completed" && (
                <p className="text-slate-400 text-xs mt-1">{s.vulnerabilities?.length || 0} findings</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
