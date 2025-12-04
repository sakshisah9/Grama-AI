from app.ai.structures.state import FlowState

def feature_node(state: FlowState):
    """
    Feature engineering node.
    Converts raw village input fields into engineered numerical features
    needed by the AI layout planning process.
    """

    village = state["village_data"]

    features = {
        "population_density": village["population"] / village["area_sq_km"],
        "water_per_capita": village["water_supply_lpd"] / village["population"],
        "green_cover_ratio": village["green_area_sq_km"] / village["area_sq_km"],
        "solar_score": village["solar_irradiance_kwpm2"] / 5.5,  # normalized solar potential
    }

    # Update state
    state["features"] = features
    return state

