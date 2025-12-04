# 🌾 Grama-AI — AI-Powered Smart Rural Planning Platform

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![LangGraph](https://img.shields.io/badge/LangGraph-AI%20Pipeline-purple)
![Groq](https://img.shields.io/badge/Groq-Llama--3.3--70B-orange)
![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-yellow)

Grama-AI is a next-generation Generative AI platform designed to automate smart village planning through sustainable, data-driven layout generation. It integrates AI reasoning, geospatial insights, and sustainability metrics to support policymakers, NGOs, and Gram Panchayats in alignment with India’s Bharat Uday 2047 vision.


---

## 🚀 Key Features

* **AI-Generated Village Layouts**
  Automated zoning, facility placement, and infrastructure planning using LangGraph and LLM-based reasoning.


* **Sustainability Scoring Engine**
  Evaluates water management, energy potential, ecological balance, and land-use efficiency.

* **Interactive Map Visualization**
  Conceptual village layouts rendered through Leaflet/Mapbox.

* **Scenario Planning Tools**
  Village parameters can be adjusted to simulate development alternatives.

* **Data-Driven Insights**
  Utilizes demographic, geospatial, and environmental datasets for decision-making.

---

## 🧠 Project Architecture (Phase 1)

* **Frontend:** React + Leaflet.js
* **Backend:** FastAPI
* **AI Module:** LangGraph (5-node pipeline)

  * Feature Engineering
  * Layout Draft Generator
  * Layout JSON Formatter
  * Sustainability Scorer
  * Sustainability Report Generator
* **Data:** Static JSON datasets with fully editable fields in the UI


---

## 📊 Expected Impact

| Metric                | Before Grama-AI     | With Grama-AI    |
| --------------------- | ------------------- | ---------------- |
| Planning Efficiency   | Manual, fragmented  | 60–70% faster    |
| Resource Utilization  | 30–40% inefficiency | 85–90% optimized |
| Service Accessibility | Uneven              | 90%+ coverage    |
| Sustainability Score  | Low/none            | Target 9.3/10    |
| Implementation Time   | Very long           | 50–60% reduction |
|                       |                     |                  |

---

## 🏛️ Core Objectives

* AI-driven rural layout generation
* Sustainability-oriented development
* Faster, evidence-based governance decisions
* Scalable architecture suitable for national deployment


---

## 🛠 Technology Stack

### Backend & AI

* FastAPI
* LangChain / LangGraph
* Groq Llama-3.3-70B-Versatile

### Frontend

* React.js
* Leaflet.js

### Visualization

* Mapbox
* Recharts

### Data

* Static JSON datasets (Phase 1)

---

## 📁 Phase-1 Deliverables

1. A working prototype for **a few villages**
2. Editable dataset fields directly visible upon village selection
3. AI-generated:

   * Layout Plan (JSON)
   * Visual layout via React + Leaflet
   * Sustainability Score
   * Comprehensive Sustainability Report
4. Exportable output formats (JSON/PDF)


---

## 📦 Getting Started

### Clone Repository

```bash
git clone https://github.com/prateekroyy/Grama-AI
cd Grama-AI
```

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing

The project is currently under private development.
Contribution guidelines will be published after the Phase-1 prototype is complete.

---

## 📄 License

This project is licensed under the **Apache License 2.0**.

---


## 🏷 Maintainers
**Grama-AI Development Team**  
Lead: [@prateekroyy](https://github.com/prateekroyy)


---