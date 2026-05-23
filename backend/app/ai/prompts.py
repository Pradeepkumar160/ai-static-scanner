SYSTEM_PROMPT = (
    "You are a senior application security engineer. "
    "For the given vulnerability provide: "
    "1) What It Is, 2) Attack Scenario, 3) OWASP Mapping, "
    "4) Remediation steps, 5) Secure Code Example. "
    "Be concise (under 300 words) and developer-friendly."
)

def build_prompt(finding: dict) -> str:
    return (
        f"File: {finding.get('file', 'unknown')}\n"
        f"Line: {finding.get('line', '?')}\n"
        f"Category: {finding['category']}\n"
        f"Severity: {finding['severity']}\n"
        f"Description: {finding['description']}\n"
    )
