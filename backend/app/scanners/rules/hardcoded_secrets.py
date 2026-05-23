import ast

SECRET_NAMES = ["password", "passwd", "secret", "token", "apikey", "api_key", "private_key"]

def detect_hardcoded_secrets(node):
    findings = []
    for target in node.targets:
        if isinstance(target, ast.Name):
            name = target.id.lower()
            if any(s in name for s in SECRET_NAMES):
                if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
                    val = node.value.value.strip()
                    if val and val not in ("", "your_key_here", "xxx", "changeme", ""):
                        findings.append({
                            "category": "Hardcoded Secret",
                            "severity": "Critical",
                            "line": node.lineno,
                            "description": f"Hardcoded credential in `{target.id}` - use environment variables.",
                        })
    return findings
