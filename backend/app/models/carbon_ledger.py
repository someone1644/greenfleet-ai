"""
GreenFlow AI - Carbon Credits Ledger Models
===========================================
Strict schemas for recording and presenting quantified CO2 emission reductions
produced by optimization runs.

IMPORTANT:
- Potential credit equivalent is a QUANTIFICATION ONLY (1 tCO2e = 1 potential unit).
- These are NOT certified, tradable, or issued carbon credits.
- Carbon shadow value is internal corporate valuation (@ configured rate INR 2,500/t).
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class CarbonLedgerRecord(BaseModel):
    """Immutable audit record of quantified CO2 emission reductions from a single optimization run."""
    ledger_id: str = Field(..., description="Unique ledger entry identifier (e.g. CL-0001)")
    run_id: str = Field(..., description="Optimization run identifier (e.g. OPT-2026-08-22-001)")
    timestamp: str = Field(..., description="ISO 8601 creation timestamp")
    scenario: str = Field(..., description="Scenario context (e.g. Normal Operations, Peak Demand Surge)")
    baseline_co2_kg: float = Field(..., description="Baseline uncoordinated fleet CO2 emissions in kg")
    optimised_co2_kg: float = Field(..., description="Optimized GreenFlow fleet CO2 emissions in kg")
    co2_avoided_kg: float = Field(..., description="Physical CO2 emissions avoided in kg (baseline - optimised)")
    co2_avoided_tonnes: float = Field(..., description="Avoided emissions in metric tonnes (co2_avoided_kg / 1000)")
    potential_credit_equivalent: float = Field(
        ..., description="Potential carbon-credit equivalent in tCO2e (Quantification only - not verified or issued)"
    )
    carbon_shadow_rate_per_tonne: float = Field(
        default=2500.0, description="Internal corporate carbon shadow rate in INR/tonne"
    )
    carbon_shadow_value: float = Field(
        ..., description="Internal corporate economic shadow value of avoided carbon in INR"
    )
    verification_status: str = Field(
        default="Not verified", description="Verification status: Not verified | Not issued | Quantification only"
    )
    source: str = Field(default="GreenFlow optimisation run", description="Originating solver execution")
    methodology_status: str = Field(default="Quantification only", description="Methodology qualification")


class CarbonLedgerSummaryResponse(BaseModel):
    """Aggregate summary of all ledger records for top KPI cards."""
    total_records: int = Field(..., description="Total recorded optimization runs in ledger")
    total_co2_avoided_kg: float = Field(..., description="Cumulative physical CO2 avoided in kg")
    total_co2_avoided_tonnes: float = Field(..., description="Cumulative avoided emissions in metric tonnes")
    total_potential_credit_equivalent: float = Field(
        ..., description="Total potential credit equivalent in tCO2e (Quantification only)"
    )
    total_carbon_shadow_value: float = Field(
        ..., description="Cumulative internal carbon shadow value in INR"
    )
    verification_status: str = Field(default="Not verified", description="Overall ledger verification status")
    configured_carbon_rate_per_tonne: float = Field(
        default=2500.0, description="Active internal carbon shadow price in INR/t"
    )
    disclaimer: str = Field(
        default="Potential credit-equivalent values represent quantified emission reductions only. They are not verified or issued carbon credits.",
        description="Statutory carbon accounting disclaimer"
    )


class CarbonLedgerListResponse(BaseModel):
    """Full list response of carbon ledger records."""
    summary: CarbonLedgerSummaryResponse
    records: List[CarbonLedgerRecord]
    disclaimer: str = Field(
        default="Potential credit-equivalent values represent quantified emission reductions only. They are not verified or issued carbon credits."
    )


class RecordOptimizationRunRequest(BaseModel):
    """Request payload to record an optimization run into the ledger."""
    run_id: Optional[str] = None
    scenario: Optional[str] = "Normal Operations"
    baseline_co2_kg: float
    optimised_co2_kg: float
    carbon_shadow_rate_per_tonne: Optional[float] = 2500.0
