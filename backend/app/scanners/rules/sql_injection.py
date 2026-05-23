import ast

def detect_sql_injection(node):
    findings = []
    if isinstance(node.func, ast.Attribute) and node.func.attr in ("execute", "executemany"):
        for arg in node.args:
            if isinstance(arg, (ast.BinOp, ast.JoinedStr)):
                findings.append({
                    "category": "SQL Injection",
                    "severity": "Critical",
                    "line": node.lineno,
                    "description": "SQL query built via string concatenation - use parameterized queries.",
                })
    return findings
