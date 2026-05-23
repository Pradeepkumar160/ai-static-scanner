from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response, JSONResponse
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from io import BytesIO
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.scan import Scan
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/{scan_id}/json")
def export_json(scan_id: int, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_id,
                                  Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(404, "Scan not found")
    return JSONResponse({
        "scan_id": scan.id, "repo_url": scan.repo_url, "status": scan.status,
        "created_at": str(scan.created_at),
        "vulnerabilities": [
            {"file": v.file, "line": v.line, "category": v.category,
             "severity": v.severity, "description": v.description,
             "owasp": v.owasp, "ai_explanation": v.ai_explanation}
            for v in scan.vulnerabilities
        ]
    })

@router.get("/{scan_id}/pdf")
def export_pdf(scan_id: int, db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_id,
                                  Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(404, "Scan not found")
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=letter,
                            leftMargin=0.75*inch, rightMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.75*inch)
    styles = getSampleStyleSheet()
    story  = [
        Paragraph("AI Vulnerability Scanner Report", styles["Title"]),
        Paragraph(f"Repository: {scan.repo_url}", styles["Normal"]),
        Paragraph(f"Scan ID: {scan.id}  Status: {scan.status}", styles["Normal"]),
        Spacer(1, 0.2*inch),
    ]
    if not scan.vulnerabilities:
        story.append(Paragraph("No vulnerabilities detected.", styles["Normal"]))
    else:
        for v in scan.vulnerabilities:
            story.append(Paragraph(f"{v.category} - {v.severity}", styles["Heading2"]))
            t = Table([
                ["File", v.file or "N/A"], ["Line", str(v.line or "?")],
                ["OWASP", v.owasp or "N/A"], ["Description", v.description],
            ], colWidths=[1.2*inch, 5.8*inch])
            t.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
                ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
                ("VALIGN", (0,0), (-1,-1), "TOP"),
            ]))
            story.append(t)
            if v.ai_explanation:
                story.append(Spacer(1, 0.1*inch))
                story.append(Paragraph("AI Analysis:", styles["Heading3"]))
                story.append(Paragraph(
                    v.ai_explanation.replace("\n", "<br/>"), styles["Normal"]))
            story.append(Spacer(1, 0.25*inch))
    doc.build(story)
    buf.seek(0)
    return Response(buf.read(), media_type="application/pdf",
                    headers={"Content-Disposition": f"attachment; filename=scan_{scan_id}.pdf"})
