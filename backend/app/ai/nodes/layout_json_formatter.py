# backend/app/ai/nodes/layout_json_formatter.py

import json
import re

from pydantic import ValidationError

from app.ai.structures.state import FlowState
from app.ai.structures.schemas import LayoutOutput, Zone, Coordinate
from app.ai.model.llm import get_llm


def _extract_json(text: str) -> str:
    match = re.search(r"\{.*\}", text, re.S)
    if match:
        return match.group(0)
    raise ValueError("No JSON object found in model response")


def _fallback_layout(village: dict, features: dict) -> LayoutOutput:
    area = float(village.get("area_sq_km", 1) or 1)
    green = float(village.get("green_area_sq_km", 0) or 0)
    population = float(village.get("population", 0) or 0)

    residential_share = 0.32 if population < 2000 else 0.36
    agriculture_share = 0.26
    water_share = 0.12
    solar_share = 0.14
    public_share = 0.10
    roads_share = 0.06

    def rect(x1, y1, x2, y2):
        return [
            Coordinate(x=x1, y=y1),
            Coordinate(x=x2, y=y1),
            Coordinate(x=x2, y=y2),
            Coordinate(x=x1, y=y2),
        ]

    zone_plan = [
        Zone(
            zone_name="residential",
            purpose="Housing and neighborhood amenities",
            facilities=["homes", "community center", "small retail"],
            coordinates=rect(0.05, 0.08, 0.48, 0.45),
        ),
        Zone(
            zone_name="agriculture",
            purpose="Crop fields and productive green belt",
            facilities=["farmland", "storage sheds", "farm access paths"],
            coordinates=rect(0.52, 0.08, 0.95, 0.40),
        ),
        Zone(
            zone_name="water_harvesting",
            purpose="Catchment ponds and recharge features",
            facilities=["check dams", "ponds", "recharge wells"],
            coordinates=rect(0.08, 0.56, 0.34, 0.88),
        ),
        Zone(
            zone_name="solar_energy_zone",
            purpose="Distributed solar generation area",
            facilities=["solar arrays", "battery storage", "maintenance bay"],
            coordinates=rect(0.39, 0.58, 0.72, 0.86),
        ),
        Zone(
            zone_name="public_services",
            purpose="Civic and social infrastructure",
            facilities=["school", "clinic", "administrative office"],
            coordinates=rect(0.75, 0.56, 0.95, 0.84),
        ),
        Zone(
            zone_name="roads",
            purpose="Primary circulation and access corridors",
            facilities=["main road", "service lanes", "pedestrian links"],
            coordinates=[
                Coordinate(x=0.0, y=0.5),
                Coordinate(x=1.0, y=0.5),
            ],
        ),
    ]

    return LayoutOutput(zones=zone_plan)


def layout_json_formatter(state: FlowState) -> FlowState:
    """
    Converts the human-readable draft in state['layout_draft'] into a structured
    LayoutOutput (validated Pydantic model) using the LLM's structured output API.
    The structured result is stored in state['layout'].
    """

    draft = state.get("layout_draft", "")
    features = state.get("features", {})
    village = state.get("village_data", {})

    llm = get_llm()

    prompt = f"""
You are an AI that converts planning drafts into structured layout JSON.

Input:
Village Data:
{village}

Features:
{features}

Draft Plan:
{draft}

Task:
Produce a JSON that exactly matches the LayoutOutput schema.
- Include zones: residential, agriculture, water_harvesting,
  solar_energy_zone, public_services, roads.
- For each zone include: zone_name, purpose, facilities (list), coordinates (list of {{x,y}} between 0 and 1).
- Coordinates describe a simple polygon or polyline approximating the zone shape.
Return only the structured JSON (no commentary).
"""

    try:
        structured_llm = llm.with_structured_output(LayoutOutput)
        result = structured_llm.invoke(prompt)
        if isinstance(result, dict):
            result = LayoutOutput.model_validate(result)
    except Exception:
        try:
            response = llm.invoke(prompt)
            content = response.content if hasattr(response, "content") else str(response)
            result = LayoutOutput.model_validate(json.loads(_extract_json(content)))
        except (ValueError, json.JSONDecodeError, ValidationError, Exception):
            result = _fallback_layout(village, features)

    # store validated layout
    state["layout"] = result
    return state


if __name__ == "__main__":
    # quick local test requires a working GROQ key; this block is illustrative
    sample_state: FlowState = {
        "village_data": {"population": 1200, "area_sq_km": 2.5},
        "features": {"population_density": 480.0},
        "layout_draft": "Place residential cluster near the central road, solar farm on the south-west open field..."
    }
    out = layout_json_formatter(sample_state)
    print("LAYOUT:", out.get("layout"))
