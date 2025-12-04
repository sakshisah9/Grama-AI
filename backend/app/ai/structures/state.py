from typing import TypedDict, Dict, Any
from app.ai.structures.schemas import LayoutOutput, SustainabilityReport

class FlowState(TypedDict, total=False):
    """
    State object passed through the LangGraph pipeline.
    Fields are filled progressively by each node.
    """

    # Input from FastAPI or dataset
    village_data: Dict[str, Any]

    # Feature Engineering Output
    features: Dict[str, float]

    # Layout Planner Output
    layout: LayoutOutput

    # Sustainability Node Output
    sustainability_score: float
    sustainability_report: SustainabilityReport
