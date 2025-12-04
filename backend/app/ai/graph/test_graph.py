# backend/app/ai/graph/test_graph.py

from app.ai.graph.planning_graph import build_planning_graph
from app.ai.structures.state import FlowState

def test_graph_run():
    graph = build_planning_graph()

    # Sample test input (replace with real dataset later)
    initial_state: FlowState = {
        "village_data": {
            "population": 1500,
            "area_sq_km": 3.2,
            "water_supply_lpd": 450000,
            "green_area_sq_km": 0.5,
            "solar_irradiance_kwpm2": 5.7
        }
    }

    print("\n Running Grama-AI Pipeline...\n")

    final_state = graph.invoke(initial_state)

    print("=== FINAL STATE OUTPUT ===")
    for key, value in final_state.items():
        print(f"\n🔹 {key.upper()}:\n{value}")

    print("\n Pipeline executed successfully!\n")


if __name__ == "__main__":
    test_graph_run()
