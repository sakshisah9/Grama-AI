# backend/app/ai/graph/planning_graph.py

import json
import os
import copy
from langgraph.graph import StateGraph, END

from app.ai.structures.state import FlowState
from app.ai.nodes.feature_engineering import feature_node
from app.ai.nodes.layout_draft_generator import layout_draft_generator
from app.ai.nodes.layout_json_formatter import layout_json_formatter
from app.ai.nodes.sustainability_scoring import sustainability_scoring
from app.ai.nodes.report_generator import report_generator


def build_planning_graph():
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


async def run_pipeline(village: str, inputs: dict):
    dataset_filename = village.lower().replace(" ", "_") + ".json"
    dataset_path = os.path.join("app", "datasets", dataset_filename)

    if not os.path.exists(dataset_path):
        raise ValueError(f"Dataset not found: {dataset_filename}")

    with open(dataset_path, "r") as f:
        village_data = json.load(f)

    initial_state: FlowState = {
        "village": village,
        "inputs": inputs,
        "village_data": copy.deepcopy(village_data),
    }

    graph = build_planning_graph()
    return await graph.ainvoke(initial_state)
