# backend/app/ai/graph/test_graph_debug.py

from pprint import pprint

from app.ai.graph.planning_graph import build_planning_graph
from app.ai.structures.state import FlowState


def test_graph_debug():
    """
    Debug version of test_graph.
    Uses extreme, simple values to verify:
    - input merge
    - feature engineering
    - sustainability scoring
    - LLM report behavior
    """

    # Simple, extreme test case
    initial_state: FlowState = {
        "village_data": {
            "population": 10,
            "area_sq_km": 1,
            "water_supply_lpd": 1,      # EXTREME LOW WATER
            "green_area_sq_km": 0,
            "solar_irradiance_kwpm2": 1
        },
        # No overrides – village_data is already extreme
        "inputs": {}
    }

    print("\n🚀 Running Grama-AI DEBUG Pipeline...\n")

    graph = build_planning_graph()
    final_state = graph.invoke(initial_state)

    print("\n================ FINAL STATE OUTPUT ================\n")

    for key, value in final_state.items():
        print(f"\n🔹 {key.upper()}:")
        pprint(value)

    print("\n===================================================\n")


if __name__ == "__main__":
    test_graph_debug()
