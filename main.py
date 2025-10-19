from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid, os, shutil, json

app = FastAPI(title="VeriSci API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE_PATH = os.getenv("STORAGE_PATH", "/tmp/verisci_storage")
os.makedirs(STORAGE_PATH, exist_ok=True)

# simple in-memory store for demo
ANALYSES = {}

@app.get("/api/v1/status")
def status():
    return {"status":"ok","version":"0.1"}

@app.post("/api/v1/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    dest = os.path.join(STORAGE_PATH, f"{file_id}_{file.filename}")
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    ANALYSES[file_id] = {"id":file_id, "status":"queued", "filename":dest}
    # In production call Celery worker to process this file
    return {"job_id":file_id, "status":"queued"}

@app.get("/api/v1/analysis/{analysis_id}")
def get_analysis(analysis_id: str):
    if analysis_id not in ANALYSES:
        raise HTTPException(status_code=404, detail="Analysis not found")
    item = ANALYSES[analysis_id]
    if item.get("status") != "completed":
        return {"id":analysis_id, "status": item.get("status")}
    return item.get("result")

@app.post("/api/v1/analysis/{analysis_id}/approve")
def approve_analysis(analysis_id: str):
    if analysis_id not in ANALYSES:
        raise HTTPException(status_code=404, detail="not found")
    ANALYSES[analysis_id]['approved'] = True
    return {"id":analysis_id, "approved": True}
