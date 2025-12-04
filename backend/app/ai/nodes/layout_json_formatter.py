# backend/app/ai/nodes/layout_json_formatter.py

from app.ai.structures.state import FlowState
from app.ai.structures.schemas import LayoutOutput
from app.ai.model.llm import get_llm

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
    structured_llm = llm.with_structured_output(LayoutOutput)

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

    result: LayoutOutput = structured_llm.invoke(prompt)

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
