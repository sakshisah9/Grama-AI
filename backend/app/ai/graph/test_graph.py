# backend/app/ai/graph/test_graph.py

from app.ai.graph.planning_graph import build_planning_graph
from app.ai.structures.state import FlowState


def test_graph_run():
    graph = build_planning_graph()

    # Sample test input (minimal but sufficient)
    initial_state: FlowState = {
        "village_data": {
            "population": 1500,
            "area_sq_km": 3.2,
            "water_supply_lpd": 450000,
            "green_area_sq_km": 0.5,
            "solar_irradiance_kwpm2": 5.7
        }
    }

    print("\n🚀 Running Grama-AI Pipeline...\n")

    final_state = graph.invoke(initial_state)

    print("=== PIPELINE EXECUTION COMPLETE ===")

    # ---- Sanity checks ----
    if "result" not in final_state:
        raise RuntimeError(
            "❌ Pipeline did not produce 'result'. "
            "Check final node (report_generator)."
        )

    result = final_state["result"]

    # ---- Print final consolidated output ----
    print("\n✅ FINAL RESULT (state['result'])\n")

    print("📐 LAYOUT:")
    print(result.layout)

    print("\n🌱 SUSTAINABILITY SCORE:")
    print(result.sustainability_score)

    print("\n📄 SUSTAINABILITY REPORT:")
    print(result.sustainability_report)

    print("\n🎉 Test completed successfully!\n")


if __name__ == "__main__":
    test_graph_run()
