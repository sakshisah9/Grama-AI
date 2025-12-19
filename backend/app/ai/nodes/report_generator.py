# backend/app/ai/nodes/report_generator.py

from app.ai.structures.state import FlowState
from app.ai.structures.schemas import SustainabilityReport, PlanningResult
from app.ai.model.llm import get_llm


def report_generator(state: FlowState) -> FlowState:
    """
    Generates a sustainability report using strict, rule-guided LLM reasoning.

    The LLM is explicitly instructed how to interpret numeric values
    to avoid optimistic or contradictory hallucinations.
    """

    llm = get_llm()
    structured_llm = llm.with_structured_output(SustainabilityReport)

    village = state.get("village_data", {})
    features = state.get("features", {})
    score = state.get("sustainability_score")

    prompt = f"""
You are an expert sustainability analyst evaluating a rural village plan.

Your task is to generate a structured sustainability report based STRICTLY
on the numeric data and rules below. You must follow these rules exactly.

====================
INTERPRETATION RULES (MANDATORY)
====================

1. WATER AVAILABILITY
- Use water_per_capita from Engineered Features.
- If water_per_capita < 50 → classify as "severe water scarcity".
- If water_per_capita is between 50 and 100 → classify as "moderate water stress".
- If water_per_capita > 100 → classify as "adequate water supply".
- If water_per_capita <= 5 → MUST mention "critical water emergency".
- You MUST NOT claim good or adequate water supply if water_per_capita < 100.

2. GREEN COVER
- Use green_cover_ratio.
- If green_cover_ratio < 0.1 → classify as "very low green cover".
- If green_cover_ratio between 0.1 and 0.3 → classify as "limited green cover".
- If green_cover_ratio > 0.3 → classify as "healthy green cover".

3. SOLAR POTENTIAL
- Use solar_score.
- If solar_score < 0.8 → classify as "low solar potential".
- If solar_score between 0.8 and 1.0 → classify as "moderate solar potential".
- If solar_score > 1.0 → classify as "high solar potential".

4. POPULATION PRESSURE
- Use population_density.
- If population_density > 400 → classify as "high population pressure".
- If population_density between 200 and 400 → classify as "moderate population pressure".
- If population_density < 200 → classify as "low population pressure".

5. SUSTAINABILITY SCORE CONSISTENCY
- If sustainability_score < 5:
  - DO NOT list environmental or infrastructure factors as strengths.
- If sustainability_score >= 7:
  - You MAY list strengths, but they must match numeric evidence.

6. CONTRADICTION RULE (CRITICAL)
- You MUST NOT list something as a strength if it is mentioned as a weakness.
- You MUST NOT contradict numeric indicators.
- Numeric data OVERRIDES narrative assumptions.

====================
INPUT DATA
====================

Village Data:
{village}

Engineered Features:
{features}

Sustainability Score:
{score}

Layout (for context only, do NOT infer resource availability from layout):
{state.get("layout")}

====================
TASK
====================

Produce a structured sustainability report with the following fields ONLY:
- strengths: list of factual strengths supported by numeric data
- weaknesses: list of risks or deficiencies supported by numeric data
- recommendations: actionable improvements addressing weaknesses
- priority_actions: top 5 concrete actions, ordered by urgency

IMPORTANT:
- Base all conclusions on the numeric data above.
- Extreme values (very low or very high) MUST be explicitly reflected.
- Return ONLY valid JSON matching the SustainabilityReport schema.
"""

    result: SustainabilityReport = structured_llm.invoke(prompt)

    state["sustainability_report"] = result
    state["result"] = PlanningResult(
        layout=state["layout"],
        sustainability_score=score,
        sustainability_report=result,
    )

    return state
