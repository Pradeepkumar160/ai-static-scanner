from app.core.config import settings
from app.ai.prompts import SYSTEM_PROMPT, build_prompt

def generate_ai_explanation(finding: dict) -> str:
    prompt = build_prompt(finding)

    if settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("sk-your"):
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=600,
            )
            return resp.choices[0].message.content
        except Exception as e:
            print(f"[OpenAI] error: {e}")

    if settings.ANTHROPIC_API_KEY and not settings.ANTHROPIC_API_KEY.startswith("sk-ant-your"):
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            resp = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=600,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt}],
            )
            return resp.content[0].text
        except Exception as e:
            print(f"[Anthropic] error: {e}")

    return (
        f"**{finding['category']}** at line {finding.get('line', '?')}.\n\n"
        f"{finding['description']}\n\n"
        f"OWASP: {finding.get('owasp', 'See OWASP Top 10')}\n\n"
        "Add OPENAI_API_KEY or ANTHROPIC_API_KEY in backend/.env for AI explanations."
    )
