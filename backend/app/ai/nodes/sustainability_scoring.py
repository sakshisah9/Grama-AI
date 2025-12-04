# backend/app/ai/nodes/sustainability_scoring.py

from app.ai.structures.state import FlowState

def sustainability_scoring(state: FlowState) -> FlowState:
    """
    Deterministic sustainability scoring based on features already computed.
    The score is a float between 0 and 10 stored in state['sustainability_score'].
    """

    features = state.get("features", {})
    # fallback defaults to avoid ZeroDivision
    green = features.get("green_cover_ratio", 0.0)
    solar = features.get("solar_score", 0.0)
    water = features.get("water_per_capita", 0.0)
    pop_density = features.get("population_density", 1.0)

    score = (
        0.30 * min(1, green * 3) +                       # green cover importance
        0.30 * min(1, solar) +                           # solar potential
        0.20 * min(1, water / 100) +                     # water per capita normalization
        0.20 * min(1, 5000 / max(1, pop_density))        # density idealization
    )

    final_score = round(score * 10, 2)
    state["sustainability_score"] = final_score
    return state


if __name__ == "__main__":
    sample_state = {
        "features": {
            "green_cover_ratio": 0.2,
            "solar_score": 0.9,
            "water_per_capita": 300,
            "population_density": 400
        }
    }
    out = sustainability_scoring(sample_state)
    print("SCORE:", out["sustainability_score"])
