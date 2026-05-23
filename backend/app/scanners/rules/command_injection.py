import ast

DANGEROUS = ["system", "popen", "call", "run", "Popen", "check_output", "check_call"]

def detect_command_injection(node):
    findings = []
    func = node.func
    attr = None
    if isinstance(func, ast.Attribute):
        attr = func.attr
    elif isinstance(func, ast.Name):
        attr = func.id
    if attr in DANGEROUS:
        if node.args and not isinstance(node.args[0], ast.Constant):
            findings.append({
                "category": "Command Injection",
                "severity": "High",
                "line": node.lineno,
                "description": f"Call to `{attr}` with non-literal argument may allow command injection.",
            })
    return findings
