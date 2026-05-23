from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, scan, reports
from app.core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Static Vulnerability Scanner",
    description="SAST platform powered by AST analysis + LLM explanations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(scan.router)
app.include_router(reports.router)

@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "AI Static Vulnerability Scanner"}

@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}
