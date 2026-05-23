from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.vulnerability import VulnerabilityOut

class ScanRequest(BaseModel):
    repo_url: str

class ScanOut(BaseModel):
    id: int
    repo_url: str
    status: str
    task_id: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    vulnerabilities: List[VulnerabilityOut] = []

    class Config:
        from_attributes = True
