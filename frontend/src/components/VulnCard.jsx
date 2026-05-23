import { useState } from "react";

const SEV_BORDER = { Critical:"border-red-500 bg-red-900/20", High:"border-orange-400 bg-orange-900/20", Medium:"border-yellow-400 bg-yellow-900/20", Low:"border-green-400 bg-green-900/20" };
const SEV_BADGE  = { Critical:"bg-red-600", High:"bg-orange-500", Medium:"bg-yellow-500 text-black", Low:"bg-green-600" };

export default function VulnCard({ vuln }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"border rounded-lg p-4 mb-3 " + (SEV_BORDER[vuln.severity] || "border-slate-600")}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <div>
          <span className={"text-xs font-bold px-2 py-0.5 rounded mr-2 " + (SEV_BADGE[vuln.severity] || "bg-slate-600")}>{vuln.severity}</span>
          <span className="font-semibold text-white">{vuln.category}</span>
          <span className="text-slate-400 text-sm ml-3">{vuln.file}:{vuln.line}</span>
        </div>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-slate-300 text-sm"><strong>OWASP:</strong> {vuln.owasp}</p>
          <p className="text-slate-300 text-sm"><strong>Issue:</strong> {vuln.description}</p>
          {vuln.ai_explanation && (
            <div className="bg-slate-800 rounded p-3 mt-2">
              <p className="text-cyan-400 text-xs font-bold mb-1">AI Explanation</p>
              <pre className="text-slate-200 text-xs whitespace-pre-wrap">{vuln.ai_explanation}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
