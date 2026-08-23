"""
GreenFlow AI - Carbon Credits Ledger Service
============================================
Isolated, thread-safe service to record and audit quantified CO2 emissions reductions
from GreenFlow quantum-inspired optimization runs.

IMPORTANT COMPLIANCE CONSTRAINTS:
1. Potential credit equivalent is a QUANTIFICATION ONLY (1 tCO2e = 1 potential unit).
2. Not certified, issued, or tradable carbon credits.
3. Uses configured internal shadow rate (INR 2,500/tonne = INR 2.50/kg).
"""

import threading
from datetime import datetime, timezone
from typing import Dict, List, Optional
from backend.app.models.carbon_ledger import (
    CarbonLedgerRecord,
    CarbonLedgerSummaryResponse,
    CarbonLedgerListResponse,
)


class CarbonLedgerStore:
    """Thread-safe in-memory store for immutable carbon reduction ledger entries."""

    def __init__(self):
        self._lock = threading.Lock()
        self._records: Dict[str, CarbonLedgerRecord] = {}  # ledger_id -> Record
        self._run_id_map: Dict[str, str] = {}  # run_id -> ledger_id
        self._counter: int = 0

    def record_run(
        self,
        baseline_co2_kg: float,
        optimised_co2_kg: float,
        scenario: str = "Normal Operations",
        run_id: Optional[str] = None,
        carbon_shadow_rate_per_tonne: float = 2500.0,
    ) -> CarbonLedgerRecord:
        """
        Records a completed optimization run into the carbon ledger.
        Idempotent: if run_id already exists, returns existing record.
        """
        with self._lock:
            # Generate deterministic or unique run_id if not supplied
            now_iso = datetime.now(timezone.utc).isoformat()
            if not run_id:
                run_id = f"OPT-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{self._counter + 1:03d}"

            # Idempotency check: prevent duplicate records for the same run
            if run_id in self._run_id_map:
                existing_id = self._run_id_map[run_id]
                return self._records[existing_id]

            self._counter += 1
            ledger_id = f"CL-{self._counter:04d}"

            co2_avoided_kg = round(max(0.0, float(baseline_co2_kg) - float(optimised_co2_kg)), 2)
            co2_avoided_tonnes = round(co2_avoided_kg / 1000.0, 4)
            potential_credit_equivalent = co2_avoided_tonnes
            shadow_value = round(co2_avoided_tonnes * float(carbon_shadow_rate_per_tonne), 2)

            record = CarbonLedgerRecord(
                ledger_id=ledger_id,
                run_id=run_id,
                timestamp=now_iso,
                scenario=scenario,
                baseline_co2_kg=round(float(baseline_co2_kg), 1),
                optimised_co2_kg=round(float(optimised_co2_kg), 1),
                co2_avoided_kg=co2_avoided_kg,
                co2_avoided_tonnes=co2_avoided_tonnes,
                potential_credit_equivalent=potential_credit_equivalent,
                carbon_shadow_rate_per_tonne=float(carbon_shadow_rate_per_tonne),
                carbon_shadow_value=shadow_value,
                verification_status="Not verified",
                source="GreenFlow optimisation run",
                methodology_status="Quantification only",
            )

            self._records[ledger_id] = record
            self._run_id_map[run_id] = ledger_id
            return record

    def list_records(self) -> List[CarbonLedgerRecord]:
        """Returns all ledger records ordered chronologically (newest first)."""
        with self._lock:
            return list(reversed(list(self._records.values())))

    def get_record(self, ledger_id: str) -> Optional[CarbonLedgerRecord]:
        """Retrieves a specific ledger record by ID."""
        with self._lock:
            return self._records.get(ledger_id)

    def get_summary(self, configured_rate: float = 2500.0) -> CarbonLedgerSummaryResponse:
        """Returns aggregate ledger KPIs."""
        with self._lock:
            records = list(self._records.values())
            total_records = len(records)
            tot_co2_kg = round(sum(r.co2_avoided_kg for r in records), 2)
            tot_tonnes = round(sum(r.co2_avoided_tonnes for r in records), 4)
            tot_credit = tot_tonnes
            tot_shadow = round(sum(r.carbon_shadow_value for r in records), 2)

            return CarbonLedgerSummaryResponse(
                total_records=total_records,
                total_co2_avoided_kg=tot_co2_kg,
                total_co2_avoided_tonnes=tot_tonnes,
                total_potential_credit_equivalent=tot_credit,
                total_carbon_shadow_value=tot_shadow,
                verification_status="Not verified",
                configured_carbon_rate_per_tonne=configured_rate,
                disclaimer="Potential credit-equivalent values represent quantified emission reductions only. They are not verified or issued carbon credits.",
            )

    def get_full_response(self, configured_rate: float = 2500.0) -> CarbonLedgerListResponse:
        """Returns full list response with summary."""
        summary = self.get_summary(configured_rate=configured_rate)
        records = self.list_records()
        return CarbonLedgerListResponse(
            summary=summary,
            records=records,
            disclaimer=summary.disclaimer,
        )

    def reset(self):
        """Resets the in-memory ledger store."""
        with self._lock:
            self._records.clear()
            self._run_id_map.clear()
            self._counter = 0


# Global singleton instance
carbon_ledger_store = CarbonLedgerStore()
