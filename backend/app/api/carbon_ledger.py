"""
GreenFlow AI - Carbon Credits Ledger API Router
===============================================
Read and record endpoints for quantified CO2 emission reductions and
potential carbon-credit equivalents.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.app.models.carbon_ledger import (
    CarbonLedgerRecord,
    CarbonLedgerSummaryResponse,
    CarbonLedgerListResponse,
    RecordOptimizationRunRequest,
)
from simulation.carbon_ledger import carbon_ledger_store
from simulation.engine import simulation_engine

router = APIRouter(prefix="/carbon", tags=["Carbon Credits Ledger"])


@router.get("/ledger", response_model=CarbonLedgerListResponse, summary="Get full Carbon Credits Ledger")
def get_carbon_ledger():
    """
    Returns full list of recorded optimization runs with avoided emissions,
    potential credit equivalents (quantification only), and internal carbon shadow values.
    """
    configured_rate = simulation_engine.carbon_pricing.internal_shadow_price_per_tonne
    return carbon_ledger_store.get_full_response(configured_rate=configured_rate)


@router.get("/ledger/summary", response_model=CarbonLedgerSummaryResponse, summary="Get Carbon Ledger Summary KPIs")
def get_carbon_ledger_summary():
    """Returns top-level cumulative KPI metrics across all ledger entries."""
    configured_rate = simulation_engine.carbon_pricing.internal_shadow_price_per_tonne
    return carbon_ledger_store.get_summary(configured_rate=configured_rate)


@router.get("/ledger/{ledger_id}", response_model=CarbonLedgerRecord, summary="Get specific Carbon Ledger record by ID")
def get_ledger_record_by_id(ledger_id: str):
    """Retrieves detailed audit record for a single optimization run."""
    record = carbon_ledger_store.get_record(ledger_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Carbon ledger record '{ledger_id}' not found.")
    return record


@router.post("/ledger/record", response_model=CarbonLedgerRecord, summary="Record completed optimization run in ledger")
def record_optimization_run(request: RecordOptimizationRunRequest):
    """
    Records a completed optimization run into the Carbon Ledger.
    Calculates physical avoided CO2, tonnes CO2e, potential credit equivalent, and shadow value.
    """
    rate = request.carbon_shadow_rate_per_tonne or simulation_engine.carbon_pricing.internal_shadow_price_per_tonne
    record = carbon_ledger_store.record_run(
        baseline_co2_kg=request.baseline_co2_kg,
        optimised_co2_kg=request.optimised_co2_kg,
        scenario=request.scenario or "Normal Operations",
        run_id=request.run_id,
        carbon_shadow_rate_per_tonne=rate,
    )
    return record
