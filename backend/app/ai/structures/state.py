from typing import TypedDict, Dict, Any
from app.ai.structures.schemas import LayoutOutput, SustainabilityReport, PlanningResult


class FlowState(TypedDict, total=False):
    """
    State object passed through the LangGraph pipeline.
    Fields are filled progressively by each node.
    """

    # 🔑 REQUIRED INPUTS (MUST be declared or LangGraph drops them)
    village: str
    inputs: Dict[str, Any]

    # 🔑 DATASET (loaded from JSON)
    village_data: Dict[str, Any]

    # 🔑 FEATURE ENGINEERING OUTPUT
    features: Dict[str, float]

    # 🔑 LAYOUT OUTPUT
    layout: LayoutOutput

    # 🔑 SCORING OUTPUT
    sustainability_score: float
    sustainability_report: SustainabilityReport

    # 🔑 FINAL AGGREGATED RESULT
    result: PlanningResult
