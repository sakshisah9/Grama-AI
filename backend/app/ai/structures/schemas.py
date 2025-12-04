from pydantic import BaseModel, Field
from typing import List

# -------------------------------
# Layout Planning Schemas
# -------------------------------

class Coordinate(BaseModel):
    """
    Normalized coordinate in the unit square (0..1).
    """
    x: float = Field(..., ge=0, le=1, description="Normalized X coordinate between 0 and 1")
    y: float = Field(..., ge=0, le=1, description="Normalized Y coordinate between 0 and 1")


class Zone(BaseModel):
    """
    A zone inside the village layout.
    """
    zone_name: str = Field(..., description="Short zone identifier, e.g., 'residential'")
    purpose: str = Field(..., description="One-line description of purpose for the zone")
    facilities: List[str] = Field(..., description="List of recommended facilities in this zone")
    coordinates: List[Coordinate] = Field(..., description="Polygon or polyline as list of normalized coordinates")


class LayoutOutput(BaseModel):
    """
    Root schema for layout planner node.
    """
    zones: List[Zone] = Field(..., description="List of zones included in the layout")


# -------------------------------
# Sustainability Report Schemas
# -------------------------------

class SustainabilityReport(BaseModel):
    """
    Structured sustainability report returned by LLM.
    """
    strengths: List[str] = Field(..., description="Key strengths observed for the village")
    weaknesses: List[str] = Field(..., description="Key weaknesses or risks")
    recommendations: List[str] = Field(..., description="Actionable recommendations")
    priority_actions: List[str] = Field(..., description="Top priority actions (ordered)")
