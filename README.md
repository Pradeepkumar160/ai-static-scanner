# 🛡️ Shield AI Scanner

> **Production-grade AI-powered Static Application Security Testing (SAST) platform**  
> Detects vulnerabilities in your code using AST analysis + AI-generated explanations.

![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- An OpenAI or Anthropic API key

### 1. Clone the repository
```bash
git clone https://github.com/Pradeepkumar160/ai-static-scanner.git
cd ai-static-scanner
```

### 2. Configure your API key
Edit `backend/.env` and add your API key:
```env
OPENAI_API_KEY=sk-...        # OpenAI key
# OR
ANTHROPIC_API_KEY=sk-ant-... # Anthropic/Claude key
```

### 3. Launch with Docker
```bash
docker compose up --build
```

### 4. Open in browser
| Service | URL |
|---------|-----|
| 🖥️ Frontend App | http://localhost:3000 |
| 📖 API Docs (Swagger) | http://localhost:8000/docs |

### 5. Register & Start Scanning
1. Go to http://localhost:3000/register
2. Create an account
3. Click **New Scan** and paste any public GitHub repo URL
4. View AI-powered vulnerability results!

---

## 🔍 What It Detects

| Vulnerability | OWASP Category | Description |
|--------------|---------------|-------------|
| SQL Injection | A03 | Detects unsafe database queries |
| Command Injection | A03 | Finds OS command execution risks |
| XSS | A03 | Cross-site scripting vulnerabilities |
| Hardcoded Secrets | A02 | API keys, passwords in source code |
| Insecure Deserialization | A08 | Unsafe object deserialization |
| Path Traversal | A01 | Directory traversal attacks |

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  PostgreSQL │
│  React/Vite │     │   FastAPI   │     │  Database   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐     ┌─────────────┐
                    │   Worker    │────▶│    Redis    │
                    │  (Scanner)  │     │    Queue    │
                    └─────────────┘     └─────────────┘
```

**Stack:**
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python FastAPI + SQLAlchemy
- **AI:** OpenAI GPT / Anthropic Claude
- **Queue:** Redis + Celery Worker
- **Database:** PostgreSQL
- **Container:** Docker + Docker Compose

---

## 📁 Project Structure

```
ai-static-scanner/
├── backend/
│   ├── app/
│   │   ├── ai/          # AI explanation engine
│   │   ├── api/         # REST API routes
│   │   ├── core/        # Config, security, database
│   │   ├── models/      # Database models
│   │   ├── scanners/    # Vulnerability detection rules
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── workers/     # Background scan workers
│   ├── .env             # Environment variables (not committed)
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # App pages
│       └── services/    # API client
└── docker-compose.yml
```

---

## ⚙️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SECRET_KEY` | JWT secret key | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | One of these |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | One of these |
| `GITHUB_TOKEN` | GitHub PAT for private repos | Optional |
| `REDIS_URL` | Redis connection string | ✅ |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for learning and building!

---

<p align="center">Built with ❤️ by <a href="https://github.com/Pradeepkumar160">Pradeep Kumar</a></p>
