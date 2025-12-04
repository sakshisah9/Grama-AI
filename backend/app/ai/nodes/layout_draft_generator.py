# backend/app/ai/nodes/layout_draft_generator.py

from typing import Any
from app.ai.structures.state import FlowState
from app.ai.model.llm import get_llm

def layout_draft_generator(state: FlowState) -> FlowState:
    """
    Uses the LLM to generate a human-readable layout draft describing zones,
    rough placements, and recommendations. The output is plain text stored
    in state['layout_draft'] for the formatter node to consume.
    """

    llm = get_llm()

    prompt = f"""
You are an expert rural planner. Produce a concise draft plan for a village.
Use the village data and engineered features below.

Village Data:
{state['village_data']}

Engineered Features:
{state.get('features')}

Task:
Write a clear, structured draft describing:
- Major zones and their relative placement
- Approximate sizes and priorities
- Suggested facility clusters (schools, clinics, solar farms, water harvesting)
- Short rationale for each suggestion

Output:
Return only the draft text. Keep it short (max ~400 words), bullet points or short paragraphs.
"""

    # Use simple invoke for unstructured text
    response = llm.invoke(prompt)
    draft_text = response.content if hasattr(response, "content") else str(response)

    state["layout_draft"] = draft_text
    return state


if __name__ == "__main__":
    # quick local test
    sample_state: FlowState = {
        "village_data": {
            "population": 1200,
            "area_sq_km": 2.5,
            "water_supply_lpd": 300000,
            "green_area_sq_km": 0.4,
            "solar_irradiance_kwpm2": 5.6
        },
        "features": {
            "population_density": 480.0,
            "water_per_capita": 250.0,
            "green_cover_ratio": 0.16,
            "solar_score": 1.018
        }
    }

    out = layout_draft_generator(sample_state)
    print("DRAFT:\n", out["layout_draft"])
