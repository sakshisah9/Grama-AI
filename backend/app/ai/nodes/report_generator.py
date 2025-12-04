# backend/app/ai/nodes/report_generator.py

from app.ai.structures.state import FlowState
from app.ai.structures.schemas import SustainabilityReport
from app.ai.model.llm import get_llm

def report_generator(state: FlowState) -> FlowState:
    """
    Uses LLM structured output to generate a detailed sustainability report
    (strengths, weaknesses, recommendations, priority_actions) based on
    village data, layout, and the computed sustainability score.
    """

    llm = get_llm()
    structured_llm = llm.with_structured_output(SustainabilityReport)

    prompt = f"""
You are an expert sustainability analyst.

Village Data:
{state.get('village_data')}

Engineered Features:
{state.get('features')}

Layout (structured):
{state.get('layout')}

Sustainability Score: {state.get('sustainability_score')}

Task:
Produce a structured sustainability report with the fields:
- strengths (list)
- weaknesses (list)
- recommendations (list)
- priority_actions (list, ordered top 5)

Return only the structured JSON matching the schema.
"""

    result: SustainabilityReport = structured_llm.invoke(prompt)

    state["sustainability_report"] = result
    return state


if __name__ == "__main__":
    # illustrative; actual call requires GROQ credentials
    sample_state = {
        "village_data": {"population": 1200, "area_sq_km": 2.5},
        "features": {"green_cover_ratio": 0.2, "solar_score": 0.9},
        "layout": None,
        "sustainability_score": 7.5
    }
    out = report_generator(sample_state)
    print("REPORT:", out.get("sustainability_report"))
