import json
import os
from langgraph.graph import StateGraph, END
from app.ai.structures.state import FlowState
from app.ai.nodes.feature_engineering import feature_node
from app.ai.nodes.layout_draft_generator import layout_draft_generator
from app.ai.nodes.layout_json_formatter import layout_json_formatter
from app.ai.nodes.sustainability_scoring import sustainability_scoring
from app.ai.nodes.report_generator import report_generator

def build_planning_graph():
    """
    Creates the full LangGraph planning pipeline.
    """
    graph = StateGraph(FlowState)

    graph.add_node("features", feature_node)
    graph.add_node("draft", layout_draft_generator)
    graph.add_node("formatter", layout_json_formatter)
    graph.add_node("scoring", sustainability_scoring)
    graph.add_node("report", report_generator)

    graph.set_entry_point("features")
    graph.add_edge("features", "draft")
    graph.add_edge("draft", "formatter")
    graph.add_edge("formatter", "scoring")
    graph.add_edge("scoring", "report")
    graph.add_edge("report", END)

    return graph.compile()


# -------------------------------------------------------
#                    NEW IMPORTANT PART
# -------------------------------------------------------

async def run_pipeline(village: str, inputs: dict):
    """
    Loads village dataset and runs the full planning pipeline.
    """

    # Convert village name -> dataset file name
    dataset_filename = village.lower().replace(" ", "_") + ".json"
    dataset_path = os.path.join("app", "datasets", dataset_filename)

    # Check if dataset exists
    if not os.path.exists(dataset_path):
        raise ValueError(f"Dataset not found for village: {dataset_path}")

    # Load JSON dataset
    with open(dataset_path, "r") as f:
        village_data = json.load(f)

    # Initial graph state
    initial_state: FlowState = {
        "village": village,
        "inputs": inputs,
        "village_data": village_data
    }

    # Build and run the planning graph
    graph = build_planning_graph()
    result = await graph.ainvoke(initial_state)

    return result
