# Celery worker skeleton (placeholder)
from celery import Celery
import time, os, json

celery = Celery('tasks', broker=os.getenv('CELERY_BROKER_URL','redis://redis:6379/0'))

@celery.task(bind=True)
def process_file(self, job_id: str, filepath: str):
    print(f"Processing {job_id} {filepath}")
    time.sleep(2)
    # mock analysis result
    result = {
        "analysis_id": job_id,
        "timestamp": "2025-10-18T11:00:00Z",
        "executive_summary": "Análisis automático (demo)",
        "overall_credibility": 52,
        "claims": [
            {"id":1,"text":"El azúcar produce adicción similar a drogas.","category":"Parcialmente correcta","credibility_percent":45,"explanation":"...","evidence":[]}
        ],
        "bibliography_apa7": ["Smith, J. (2021). Estudio ... doi:10.1111/abcd.12345"]
    }
    out_path = filepath + '.analysis.json'
    with open(out_path,'w') as f:
        json.dump(result,f)
    return True
