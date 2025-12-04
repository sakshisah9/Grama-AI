from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.graph.planning_graph import run_pipeline   # <-- FIXED IMPORT

router = APIRouter(prefix="/planning", tags=["Planning"])  # <-- More meaningful

class GenerateRequest(BaseModel):
    village: str
    inputs: dict

@router.post("/generate-layout")
async def generate_layout(req: GenerateRequest):
    """
    Calls the planning graph (feature -> draft -> formatter -> scoring -> report)
    and returns the final output.
    """
    try:
        result = await run_pipeline(req.village, req.inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
