# backend/app/routers/generate.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from app.ai.graph.planning_graph import run_pipeline

router = APIRouter(prefix="/planning", tags=["Planning"])


class GenerateRequest(BaseModel):
    village: str
    inputs: Dict[str, Any]


@router.post("/generate-layout")
async def generate_layout(req: GenerateRequest):
    try:
        state = await run_pipeline(req.village, req.inputs)

        if "result" not in state:
            raise RuntimeError("Pipeline did not produce final result")

        return state["result"].dict()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
