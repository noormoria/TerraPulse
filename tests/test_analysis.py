import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from build_intelligence import clean_features, cluster_hotspots, summarize, weekly_baseline

NOW = datetime(2026, 10, 16, tzinfo=timezone.utc)


def feature(idx, time, lat, lng, mag=5.1):
    return {"id": str(idx), "properties": {"time": int(time.timestamp()*1000), "mag": mag, "place": "Test region"},
            "geometry": {"coordinates": [lng, lat, 22]}}


class AnalysisTests(unittest.TestCase):
    def test_clean_duplicates_and_invalid_coordinates(self):
        items = [feature(1, NOW-timedelta(days=4), 20, 30), feature(1, NOW-timedelta(days=4), 20, 30),
                 feature(2, NOW-timedelta(days=2), 120, 40), feature(3, NOW+timedelta(days=1), 20, 30)]
        self.assertEqual(len(clean_features(items, NOW)), 1)

    def test_dbscan_haversine_groups_nearby_quakes(self):
        items = [feature(i, NOW-timedelta(days=i+3), 38.0 + i*.025, 143.0+i*.025) for i in range(10)]
        df = clean_features(items, NOW)
        result = cluster_hotspots(df)
        self.assertEqual(result["cluster_count"], 1)
        self.assertEqual(result["hotspots"][0]["count"], 10)

    def test_baseline_uses_complete_utc_weeks(self):
        df = clean_features([feature(1, NOW-timedelta(days=1), 20, 30)], NOW)
        weekly = weekly_baseline(df, NOW)
        self.assertEqual(weekly["recent_7d"], 1)
        self.assertEqual(weekly["baseline_weeks"], 52)
        self.assertTrue(weekly["above_baseline_p90"])

    def test_summary_never_invents_missing_events(self):
        df = clean_features([feature(i, NOW-timedelta(days=i+1), 20, 30) for i in range(14)], NOW)
        report = summarize(df, NOW)
        self.assertEqual(report["summary"]["total_events"], 14)
        self.assertEqual(sum(x["count"] for x in report["magnitude_distribution"]), 14)
        self.assertEqual(sum(x["count"] for x in report["daily_last_30d"]), 14)


if __name__ == "__main__":
    unittest.main()