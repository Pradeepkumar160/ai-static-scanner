import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import VulnCard from "../components/VulnCard";

const STATUS_COLOR = { completed:"text-green-400", running:"text-blue-400", queued:"text-yellow-400", failed:"text-red-400" };

export default function ResultsPage() {
  const { id } = useParams();
  const [scan,    setScan]    = useState(null);
  const [loading, setLoading] = useState(true);
  const statusRef = useRef(null);

  const fetchScan = async () => {
    try {
      const res = await api.get("/scan/" + id);
      setScan(res.data);
      statusRef.current = res.data.status;
    } catch { setScan(null); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchScan();
    const interval = setInterval(() => {
      if (["queued","running"].includes(statusRef.current)) fetchScan();
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading)  return <div className="text-center mt-20 text-slate-400">Loading...</div>;
  if (!scan)    return <div className="text-center mt-20 text-red-400">Scan not found.</div>;

  const critCount = (scan.vulnerabilities || []).filter(v => v.severity === "Critical").length;
  const highCount = (scan.vulnerabilities || []).filter(v => v.severity === "High").length;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      <Link to="/" className="text-slate-400 hover:text-white text-sm">Back to Dashboard</Link>
      <div className="mt-4 bg-slate-800 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-1 break-all">{scan.repo_url}</h1>
        <p className="text-slate-400 text-sm">Scan #{scan.id} - {new Date(scan.created_at).toLocaleString()}</p>
        <p className={"font-bold mt-2 " + (STATUS_COLOR[scan.status] || "text-white")}>
          {scan.status.toUpperCase()} {["queued","running"].includes(scan.status) && "(refreshing...)"}
        </p>
        {scan.status === "completed" && (
          <div className="flex gap-6 mt-4">
            <div className="text-center"><p className="text-3xl font-bold text-red-400">{critCount}</p><p className="text-slate-400 text-xs">Critical</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-orange-400">{highCount}</p><p className="text-slate-400 text-xs">High</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-white">{scan.vulnerabilities?.length || 0}</p><p className="text-slate-400 text-xs">Total</p></div>
          </div>
        )}
        {scan.status === "completed" && (
          <div className="flex gap-3 mt-4">
            <a href={"/api/reports/" + id + "/pdf"} target="_blank"
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded transition">
              Download PDF
            </a>
            <a href={"/api/reports/" + id + "/json"} target="_blank"
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded transition">
              Export JSON
            </a>
          </div>
        )}
      </div>

      {["queued","running"].includes(scan.status) && (
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-300 text-lg">Scanning repository...</p>
          <p className="text-slate-500 text-sm mt-2">Page auto-refreshes every 3 seconds.</p>
        </div>
      )}

      {scan.status === "completed" && (!scan.vulnerabilities || scan.vulnerabilities.length === 0) && (
        <div className="bg-green-900/30 border border-green-500 rounded-xl p-8 text-center">
          <p className="text-green-400 text-xl font-bold">No vulnerabilities detected!</p>
        </div>
      )}

      {scan.status === "completed" && scan.vulnerabilities?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Vulnerabilities ({scan.vulnerabilities.length})</h2>
          {["Critical","High","Medium","Low"].map(sev => {
            const items = scan.vulnerabilities.filter(v => v.severity === sev);
            if (!items.length) return null;
            return (
              <div key={sev} className="mb-6">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{sev}</h3>
                {items.map(v => <VulnCard key={v.id} vuln={v} />)}
              </div>
            );
          })}
        </div>
      )}

      {scan.status === "failed" && (
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-6 text-center">
          <p className="text-red-400 font-bold">Scan failed.</p>
          <p className="text-slate-400 mt-2">Check that the repository URL is valid and publicly accessible.</p>
        </div>
      )}
    </div>
  );
}
