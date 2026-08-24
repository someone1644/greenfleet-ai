# GreenFleet AI 
### Intelligent Fleet Decarbonization & Quantum-Inspired Route Optimization Platform

[![Python](https://img.shields.io/badge/Python-3.11%2B%20%7C%203.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB.svg)](https://react.dev/)
[![Optimization](https://img.shields.io/badge/Optimization-QUBO%20%7C%20Simulated%20Annealing-blueviolet.svg)](https://github.com/someone1644/greenfleet-ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**GreenFleet AI** is an enterprise-grade fleet decarbonization and dispatch platform. It bridges physics-grounded machine learning, quantum-inspired combinatorial optimization, real-time IoT driver telemetry, and rigorous carbon accounting to minimize fuel waste, cut operational expenditure, and enforce corporate carbon budgets.

---

## Key Highlights & Capabilities

### 1. Physics-Grounded ML & Conformal Prediction (Model 1)
- **Gradient Boosted Decision Trees (GBDT/LightGBM)** trained on high-dimensional fleet telemetry (payload, gradient, speed variance, ambient temperature, vehicle powertrain).
- **Conformal Prediction Intervals ($90\%$ coverage guarantee):** Generates rigorous non-parametric upper and lower bounds for predicted fuel consumption rather than brittle point estimates.
- **Risk-Averse Objective Formulation:** Downstream optimization accounts for tail uncertainty via configurable risk aversion ($\lambda$).

### 2. Quantum-Inspired Route Optimization (QUBO)
- Formulates fleet dispatch as a **Quadratic Unconstrained Binary Optimization (QUBO)** problem.
- Solved via **Simulated Annealing** with automatic fallback to **Mixed-Integer Linear Programming (MILP)** and the **Hungarian Algorithm**.
- Optimizes assignment across heterogeneous vehicle types (EV, Diesel, Petrol, CNG, Hybrid) while strictly enforcing hard constraints (load capacity, route range, time windows, and vehicle availability).

### 3. Dynamic Carbon Budget Governor & Hard Cap
- Continuously monitors cumulative fleet emissions against organizational carbon budgets.
- Automatically computes a dynamic carbon penalty multiplier ($1.0\times \to 2.0\times$) during surge conditions (e.g., peak demand, extreme traffic).
- Hard constraint enforcement guarantees total fleet emissions never exceed mandated thresholds.

### 4. Continuous Telemetry & Driver Behavior Scoring (Model 2)
- Evaluates driving events in real-time (harsh acceleration, hard braking, excessive idling, speeding).
- Computes dynamic driver efficiency scores ($0 - 100$) and feeds behavioral efficiency multipliers back into dispatch predictions.

### 5. Multi-Fuel Commercial Economics & Shadow Valuation
- **Direct Cash Fuel Spend Saved:** Calculates direct fuel cost reduction accounting for actual fuel prices (Diesel ₹95/L, Petrol ₹105/L, CNG ₹85/kg, EV ₹8/kWh).
- **Internal Carbon Shadow Valuation:** Evaluates avoided emissions at a corporate carbon rate of **₹2,500 / tonne $\text{CO}_2$** (₹2.50 / kg).
- **Differentiated ROI:** Clearly separates physical fuel volume saved, direct cash saved, and carbon shadow value.

### 6. Isolated Carbon Credits Ledger
- Audit-ready quantification of avoided $\text{CO}_2$ emissions across optimization runs.
- Tracks potential carbon-credit equivalents ($1\text{ tCO}_2\text{e} = 1\text{ potential unit}$) with clear verification disclosures (*Quantification only — not certified/issued credits*).
- Full step-by-step calculation transparency for ESG reporting and compliance audits.

### 7. Explainable AI (XAI) & Counterfactuals
- Transparent vehicle suitability scoring ($0 - 100$).
- Shapley-inspired feature attribution breakdown (Payload, Distance, Gradient, Powertrain match).
- Clear, natural-language *"Why was Vehicle A chosen over Vehicle B?"* explanations.

---

## Platform Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        GreenFleet AI Platform                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   ML Engine      │     │  Quantum Solver  │     │ Carbon Governor  │
│ ──────────────── │     │ ──────────────── │     │ ──────────────── │
│ • LightGBM Model │     │ • QUBO Formulator│     │ • Budget Tracker │
│ • Conformal Pred │     │ • Annealing      │     │ • Dynamic Penalty│
│ • Telemetry / XAI│     │ • MILP Fallback  │     │ • Hard Cap Rules │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                ┌──────────────────────────────────┐
                │       FastAPI REST Engine        │
                │  /api/simulate | /api/carbon     │
                └─────────────────┬────────────────┘
                                  │
                                  ▼
                ┌──────────────────────────────────┐
                │      React + Vite Dashboard      │
                │ • Plan & Optimize Console        │
                │ • Live Map & Driver Telemetry    │
                │ • Analytics & Carbon Ledger      │
                │ • What-If & Scenario Simulator   │
                └──────────────────────────────────┘
```

---

## Repository Structure

```text
greenfleet-ai/
├── backend/                  # FastAPI Application
│   └── app/
│       ├── api/              # REST Endpoints (fleet, simulation, carbon, telemetry)
│       ├── core/             # Optimization algorithms, explainability, conformal bounds
│       ├── models/           # Pydantic schemas (simulation, economics, carbon ledger)
│       └── main.py           # FastAPI entry point
├── frontend/                 # React 19 + Vite UI
│   ├── src/
│   │   ├── components/       # UI Components (plan, live map, analytics, carbon ledger)
│   │   ├── services/         # API Client and WebSocket services
│   │   └── App.jsx           # Root Application
│   └── package.json
├── ml_engine/                # Machine Learning Pipeline
│   ├── inference/            # Prediction, risk aversion & driver behavior detectors
│   ├── training/             # Data preprocessing, training scripts & artifacts
│   └── models/               # Serialized LightGBM models & calibration sets
├── simulation/               # In-Memory Fleet Simulation Engine
│   ├── engine.py             # Simulation state & lifecycle manager
│   ├── carbon_governor.py    # Carbon budget dynamic pricing & hard cap
│   └── carbon_ledger.py      # Thread-safe Carbon Credits Ledger store
├── tests/                    # Pytest & Unittest validation suites (62+ tests)
├── scripts/                  # Verification & demo audit scripts
└── pytest.ini                # Test configuration
```

---

## Quickstart Guide

### Prerequisites
- **Python 3.11+** or **3.12**
- **Node.js 18+** & **npm**

---

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/someone1644/greenfleet-ai.git
cd greenfleet-ai

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at **`http://127.0.0.1:8000/docs`**.

---

### 2. Frontend Setup

```bash
# In a separate terminal, navigate to the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```
Open your browser and navigate to **`http://localhost:5173/`**.

---

## Testing & Verification

GreenFleet AI includes an automated verification and testing pipeline:

```bash
# Run pytest test suite (62 passing tests)
pytest tests/

# Run python standard unittest discovery
python -m unittest discover -s tests

# Run frontend production build validation
cd frontend && npm run build

# Run the authoritative 6-stage end-to-end demo verification
python scripts/verify_p0_demo.py
```

---

## Live Verification Stages (`verify_p0_demo.py`)

1. **Stage 1: Normal Baseline State** — 12 routes, 20 vehicles, 69.6% carbon budget utilization.
2. **Stage 2: Peak Demand Anomaly** — 15 routes, carbon governor penalty increases to $1.52\times$.
3. **Stage 3: Optimization Execution** — $21.6\text{ kg } \text{CO}_2\text{e}$ reduced ($1.7\%$), $2.5\text{ L}$ fuel saved.
4. **Stage 4: Commercial Economics** — ₹394.50 direct cash saved + ₹54.00 carbon shadow value = **₹448.50 combined impact**.
5. **Stage 5: Conformal Explainability** — 90% conformal prediction interval $[1.27\text{ L} - 6.13\text{ L}]$, suitability score 95.7/100.
6. **Stage 6: Real-Time Telemetry** — Dynamic driver scoring with continuous alert generation.

---

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
