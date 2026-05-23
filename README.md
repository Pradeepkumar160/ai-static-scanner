# AI Static Code Vulnerability Scanner

Production-grade SAST platform using AST analysis + AI explanations.

## Quick Start

1. Edit `backend/.env` - add your API key:
   - `OPENAI_API_KEY=sk-...`  OR
   - `ANTHROPIC_API_KEY=sk-ant-...`

2. Launch:
   ```
   docker compose up --build
   ```

3. Open:
   - Frontend: http://localhost:3000
   - API Docs:  http://localhost:8000/docs

## What It Detects
- SQL Injection (A03)
- Command Injection (A03)
- XSS (A03)
- Hardcoded Secrets (A02)
- Insecure Deserialization (A08)
- Path Traversal (A01)
