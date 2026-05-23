import ast

XSS_SINKS = ["render", "render_template_string", "Markup", "innerHTML"]

def detect_xss(node):
    findings = []
    func = node.func
    name = None
    if isinstance(func, ast.Attribute):
        name = func.attr
    elif isinstance(func, ast.Name):
        name = func.id
    if name in XSS_SINKS:
        for arg in node.args:
            if not isinstance(arg, ast.Constant):
                findings.append({
                    "category": "XSS",
                    "severity": "High",
                    "line": node.lineno,
                    "description": f"`{name}` called with user-controlled input - may allow reflected XSS.",
                })
    return findings
