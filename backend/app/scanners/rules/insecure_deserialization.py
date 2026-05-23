import ast

UNSAFE = {"pickle": ["loads", "load"], "yaml": ["load"], "marshal": ["loads"]}

def detect_insecure_deserialization(node):
    findings = []
    func = node.func
    if isinstance(func, ast.Attribute):
        module = func.value.id if isinstance(func.value, ast.Name) else ""
        if module in UNSAFE and func.attr in UNSAFE[module]:
            findings.append({
                "category": "Insecure Deserialization",
                "severity": "High",
                "line": node.lineno,
                "description": f"`{module}.{func.attr}` is unsafe - use safe alternatives.",
            })
    return findings
