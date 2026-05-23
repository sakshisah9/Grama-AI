import json
import re

from pydantic import ValidationError

from app.ai.structures.state import FlowState
from app.ai.structures.schemas import SustainabilityReport, PlanningResult
from app.ai.model.llm import get_llm


def _extract_json(text: str) -> str:
    match = re.search(r"\{.*\}", text, re.S)
    if match:
        return match.group(0)
    raise ValueError("No JSON object found in model response")


def _fallback_report(features: dict, score: float) -> SustainabilityReport:
    green = float(features.get("green_cover_ratio", 0.0) or 0.0)
    solar = float(features.get("solar_score", 0.0) or 0.0)
    water = float(features.get("water_per_capita", 0.0) or 0.0)
    density = float(features.get("population_density", 0.0) or 0.0)

    strengths = []
    weaknesses = []

    if green >= 0.3:
      strengths.append("Healthy green cover supports environmental balance.")
    elif green >= 0.1:
      strengths.append("Moderate green cover provides some ecological support.")
    else:
      weaknesses.append("Green cover is low and should be expanded.")

    if solar >= 1.0:
      strengths.append("Solar potential is strong for renewable energy deployment.")
    elif solar >= 0.8:
      strengths.append("Solar potential is moderate and can be improved with rooftop systems.")
    else:
      weaknesses.append("Solar potential is limited and needs efficiency-focused planning.")

    if water <= 5:
      weaknesses.append("Critical water emergency conditions require immediate intervention.")
    elif water < 50:
      weaknesses.append("Severe water scarcity is present.")
    elif water < 100:
      weaknesses.append("Water availability shows moderate stress.")
    else:
      strengths.append("Water availability is adequate for current demand.")

    if density > 400:
      weaknesses.append("Population pressure is high and will strain services.")
    elif density >= 200:
      weaknesses.append("Population density is moderate and needs careful service planning.")
    else:
      strengths.append("Population density is relatively low and easier to service.")

    if not strengths:
        strengths.append("The village has a balanced planning profile in the available data.")
    if not weaknesses:
        weaknesses.append("No major weaknesses were detected from the available numeric features.")

    recommendations = [
        "Prioritize water resilience measures such as harvesting, storage, and recharge.",
        "Expand renewable energy and rooftop solar where feasible.",
        "Protect and increase green areas through plantation and buffer zones.",
    ]

    priority_actions = [
        "Implement immediate water management interventions.",
        "Reserve land for solar and utility infrastructure.",
        "Strengthen green buffers around residential areas.",
        "Improve access roads and service circulation.",
        "Add civic facilities near the residential core.",
    ]

    return SustainabilityReport(
        strengths=strengths[:4],
        weaknesses=weaknesses[:4],
        recommendations=recommendations,
        priority_actions=priority_actions,
    )


def report_generator(state: FlowState) -> FlowState:
    llm = get_llm()

    village = state.get("village_data", {})
    features = state.get("features", {})
    score = state.get("sustainability_score")

    prompt = f"""
You are an expert sustainability analyst evaluating a rural village plan.
Base all conclusions only on the numeric data provided below.

Village Data:
{village}

Engineered Features:
{features}

Sustainability Score:
{score}

Return only valid JSON matching this schema:
{{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "priority_actions": ["..."]
}}
"""

    try:
        structured_llm = llm.with_structured_output(SustainabilityReport)
        result = structured_llm.invoke(prompt)
        if isinstance(result, dict):
            result = SustainabilityReport.model_validate(result)
    except Exception:
        try:
            response = llm.invoke(prompt)
            content = response.content if hasattr(response, "content") else str(response)
            result = SustainabilityReport.model_validate(json.loads(_extract_json(content)))
        except (ValueError, json.JSONDecodeError, ValidationError, Exception):
            result = _fallback_report(features, score or 0.0)

    state["sustainability_report"] = result
    state["result"] = PlanningResult(
        layout=state["layout"],
        sustainability_score=score,
        sustainability_report=result,
    )
    return state
