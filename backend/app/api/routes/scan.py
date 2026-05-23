from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.scan import Scan
from app.models.user import User
from app.schemas.scan import ScanRequest, ScanOut
from app.workers.scan_tasks import run_scan_task

router = APIRouter(prefix="/scan", tags=["scan"])

@router.post("", response_model=ScanOut, status_code=202)
def start_scan(req: ScanRequest, db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    scan = Scan(repo_url=req.repo_url, status="queued", user_id=current_user.id)
    db.add(scan)
    db.commit()
    db.refresh(scan)
    task = run_scan_task.delay(scan.id, req.repo_url)
    scan.task_id = task.id
    db.commit()
    db.refresh(scan)
    return scan

@router.get("", response_model=List[ScanOut])
def list_scans(db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    return db.query(Scan).filter(Scan.user_id == current_user.id)\
             .order_by(Scan.created_at.desc()).all()

@router.get("/{scan_id}", response_model=ScanOut)
def get_scan(scan_id: int, db: Session = Depends(get_db),
             current_user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_id,
                                  Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan

@router.delete("/{scan_id}", status_code=204)
def delete_scan(scan_id: int, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_id,
                                  Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    db.delete(scan)
    db.commit()
