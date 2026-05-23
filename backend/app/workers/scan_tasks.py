from app.workers.celery_app import celery_app
from app.scanners.repo_downloader import clone_repo
from app.services.scan_service import scan_repository
from app.core.database import SessionLocal
from app.models.scan import Scan
from app.models.vulnerability import Vulnerability
from datetime import datetime

@celery_app.task(bind=True, max_retries=3)
def run_scan_task(self, scan_id: int, repo_url: str):
    db = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            return
        scan.status = "running"
        db.commit()
        repo_path = clone_repo(repo_url)
        findings  = scan_repository(repo_path)
        for f in findings:
            db.add(Vulnerability(
                scan_id=scan_id,
                file=f.get("file"),
                line=f.get("line"),
                severity=f.get("severity", "Unknown"),
                category=f.get("category", "Unknown"),
                description=f.get("description", ""),
                owasp=f.get("owasp", ""),
                ai_explanation=f.get("ai_explanation", ""),
            ))
        scan.status = "completed"
        scan.completed_at = datetime.utcnow()
        db.commit()
    except Exception as exc:
        db.rollback()
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if scan:
            scan.status = "failed"
            db.commit()
        raise self.retry(exc=exc, countdown=5)
    finally:
        db.close()
