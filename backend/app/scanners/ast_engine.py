import ast
from app.scanners.rules.sql_injection import detect_sql_injection
from app.scanners.rules.command_injection import detect_command_injection
from app.scanners.rules.hardcoded_secrets import detect_hardcoded_secrets
from app.scanners.rules.xss import detect_xss
from app.scanners.rules.insecure_deserialization import detect_insecure_deserialization
from app.models.vulnerability import OWASP_MAP

class VulnerabilityScanner(ast.NodeVisitor):
    def __init__(self):
        self.findings = []

    def visit_Call(self, node):
        self.findings.extend(detect_sql_injection(node))
        self.findings.extend(detect_command_injection(node))
        self.findings.extend(detect_xss(node))
        self.findings.extend(detect_insecure_deserialization(node))
        self.generic_visit(node)

    def visit_Assign(self, node):
        self.findings.extend(detect_hardcoded_secrets(node))
        self.generic_visit(node)

def scan_python_file(path: str) -> list:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            source = f.read()
        tree = ast.parse(source, filename=path)
        scanner = VulnerabilityScanner()
        scanner.visit(tree)
        for finding in scanner.findings:
            finding["owasp"] = OWASP_MAP.get(finding["category"], "See OWASP Top 10")
        return scanner.findings
    except Exception:
        return []
