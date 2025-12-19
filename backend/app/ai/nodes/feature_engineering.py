# backend/app/ai/nodes/feature_engineering.py

from app.ai.structures.state import FlowState


def feature_node(state: FlowState):
    """
    Feature engineering node.

    - Merges static village dataset (village_data)
      with user-provided overrides (inputs).
    - Computes engineered numerical features.
    """

    base_village = state["village_data"]
    overrides = state.get("inputs", {})

    # Merge: user inputs override dataset values
    village = {**base_village, **overrides}

    features = {
        "population_density": village["population"] / village["area_sq_km"],
        "water_per_capita": village["water_supply_lpd"] / village["population"],
        "green_cover_ratio": village["green_area_sq_km"] / village["area_sq_km"],
        "solar_score": village["solar_irradiance_kwpm2"] / 5.5,
    }

    state["features"] = features
    return state
