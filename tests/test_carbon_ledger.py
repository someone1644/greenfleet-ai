"""
GreenFlow AI - Carbon Credits Ledger Unit & Integration Tests
============================================================
Validates that:
1. CarbonLedgerStore records runs idempotently without duplicates.
2. CO2 avoided, tonnes, potential credit equivalent, and shadow value calculations follow strict rules.
3. Quantified metrics are clearly distinguished from certified/tradable credits.
4. API endpoints /api/carbon/ledger, /api/carbon/ledger/summary, /api/carbon/ledger/{id}, and /api/carbon/ledger/record work properly.
"""

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app
from simulation.carbon_ledger import CarbonLedgerStore, carbon_ledger_store


class TestCarbonLedgerStore(unittest.TestCase):
    """Direct unit tests for CarbonLedgerStore calculations and data structures."""

    def setUp(self):
        self.store = CarbonLedgerStore()

    def test_record_run_calculation_rules(self):
        """Test physical reduction, metric tonnes conversion, potential credit equiv, and shadow value."""
        record = self.store.record_run(
            baseline_co2_kg=1243.5,
            optimised_co2_kg=1221.9,
            scenario="Peak Demand Surge",
            run_id="OPT-TEST-001",
            carbon_shadow_rate_per_tonne=2500.0,
        )

        self.assertEqual(record.ledger_id, "CL-0001")
        self.assertEqual(record.run_id, "OPT-TEST-001")
        self.assertEqual(record.co2_avoided_kg, 21.6)
        self.assertEqual(record.co2_avoided_tonnes, 0.0216)
        self.assertEqual(record.potential_credit_equivalent, 0.0216)
        self.assertEqual(record.carbon_shadow_value, 54.00)
        self.assertEqual(record.verification_status, "Not verified")
        self.assertEqual(record.methodology_status, "Quantification only")

    def test_idempotency_prevents_duplicate_records(self):
        """Test that recording with the same run_id does not create duplicate entries."""
        rec1 = self.store.record_run(
            baseline_co2_kg=1243.5,
            optimised_co2_kg=1221.9,
            scenario="Peak Demand Surge",
            run_id="OPT-DUPLICATE-001",
        )
        rec2 = self.store.record_run(
            baseline_co2_kg=1243.5,
            optimised_co2_kg=1221.9,
            scenario="Peak Demand Surge",
            run_id="OPT-DUPLICATE-001",
        )

        self.assertEqual(rec1.ledger_id, rec2.ledger_id)
        self.assertEqual(len(self.store.list_records()), 1)

    def test_summary_aggregation(self):
        """Test cumulative summary across multiple recorded runs."""
        self.store.record_run(
            baseline_co2_kg=1000.0,
            optimised_co2_kg=900.0,  # 100 kg avoided = 0.1 t = INR 250
            scenario="Run 1",
            run_id="OPT-001",
        )
        self.store.record_run(
            baseline_co2_kg=500.0,
            optimised_co2_kg=400.0,  # 100 kg avoided = 0.1 t = INR 250
            scenario="Run 2",
            run_id="OPT-002",
        )

        summary = self.store.get_summary(configured_rate=2500.0)
        self.assertEqual(summary.total_records, 2)
        self.assertEqual(summary.total_co2_avoided_kg, 200.0)
        self.assertEqual(summary.total_co2_avoided_tonnes, 0.2)
        self.assertEqual(summary.total_potential_credit_equivalent, 0.2)
        self.assertEqual(summary.total_carbon_shadow_value, 500.0)
        self.assertEqual(summary.verification_status, "Not verified")


class TestCarbonLedgerAPI(unittest.TestCase):
    """Integration tests for FastAPI /api/carbon/ledger endpoints."""

    def setUp(self):
        self.client = TestClient(app)
        carbon_ledger_store.reset()

    def test_get_empty_ledger(self):
        """GET /api/carbon/ledger returns empty list when no runs have occurred."""
        res = self.client.get("/api/carbon/ledger")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["summary"]["total_records"], 0)
        self.assertEqual(len(data["records"]), 0)
        self.assertIn("not verified", data["disclaimer"].lower())

    def test_record_and_retrieve_ledger_entry(self):
        """POST /api/carbon/ledger/record then GET /api/carbon/ledger."""
        post_res = self.client.post(
            "/api/carbon/ledger/record",
            json={
                "run_id": "OPT-DEMO-2026-001",
                "scenario": "Peak Demand Surge",
                "baseline_co2_kg": 1243.5,
                "optimised_co2_kg": 1221.9,
                "carbon_shadow_rate_per_tonne": 2500.0,
            },
        )
        self.assertEqual(post_res.status_code, 200)
        entry = post_res.json()
        self.assertEqual(entry["ledger_id"], "CL-0001")
        self.assertEqual(entry["co2_avoided_kg"], 21.6)
        self.assertEqual(entry["potential_credit_equivalent"], 0.0216)
        self.assertEqual(entry["carbon_shadow_value"], 54.00)

        # Retrieve single entry by ID
        get_single = self.client.get(f"/api/carbon/ledger/{entry['ledger_id']}")
        self.assertEqual(get_single.status_code, 200)
        self.assertEqual(get_single.json()["ledger_id"], "CL-0001")

        # Retrieve summary
        get_summary = self.client.get("/api/carbon/ledger/summary")
        self.assertEqual(get_summary.status_code, 200)
        s_data = get_summary.json()
        self.assertEqual(s_data["total_records"], 1)
        self.assertEqual(s_data["total_co2_avoided_kg"], 21.6)
        self.assertEqual(s_data["total_potential_credit_equivalent"], 0.0216)
        self.assertEqual(s_data["total_carbon_shadow_value"], 54.00)


if __name__ == "__main__":
    unittest.main()
