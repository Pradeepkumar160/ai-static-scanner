import os, shutil
from app.scanners.ast_engine import scan_python_file
from app.ai.llm_client import generate_ai_explanation

def scan_repository(repo_path: str) -> list:
    all_findings = []
    for root, dirs, filenames in os.walk(repo_path):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for filename in filenames:
            if filename.endswith(".py"):
                filepath = os.path.join(root, filename)
                relative = os.path.relpath(filepath, repo_path)
                findings = scan_python_file(filepath)
                for f in findings:
                    f["file"] = relative
                    f["ai_explanation"] = generate_ai_explanation(f)
                all_findings.extend(findings)
    shutil.rmtree(repo_path, ignore_errors=True)
    return all_findings
