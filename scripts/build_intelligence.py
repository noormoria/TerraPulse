"""TerraPulse reproducible historical-data pipeline.

Source: USGS FDSN event catalog, real earthquake events M4.5+.
This is retrospective clustering and activity benchmarking, NOT earthquake forecasting.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlencode

import numpy as np
import pandas as pd
import requests
from sklearn.cluster import DBSCAN

API = "https://earthquake.usgs.gov/fdsnws/event/1/query"
OUTPUT = Path(__file__).resolve().parents[1] / "data" / "insights.json"
MAGNITUDE = 4.5
EARTH_RADIUS_KM = 6371.0088
EPS_KM = 160
MIN_SAMPLES = 6


def fetch_catalog(as_of: datetime) -> list[dict]:
    """Query 53 complete UTC weeks in ~three-month blocks to avoid huge requests."""
    since = as_of - timedelta(days=371)
    start = since
    collected: list[dict] = []
    session = requests.Session()
    session.headers.update({"User-Agent": "TerraPulse/1.0 research-portfolio (USGS publicly documented API)"})
    while start < as_of:
        end = min(start + timedelta(days=90), as_of)
        params = {
            "format": "geojson", "starttime": start.strftime('%Y-%m-%dT%H:%M:%S'),
            "endtime": end.strftime('%Y-%m-%dT%H:%M:%S'),
            "minmagnitude": MAGNITUDE, "eventtype": "earthquake",
            "orderby": "time-asc", "limit": 20000,
        }
        response = session.get(API, params=params, timeout=90)
        response.raise_for_status()
        payload = response.json()
        if not isinstance(payload.get("features"), list):
            raise ValueError("Unexpected USGS catalog response")
        if len(payload["features"]) >= 20000:
            raise ValueError("USGS query reached its per-request limit; subdivide time range")
        collected.extend(payload["features"])
        start = end
    return collected


def clean_features(features: list[dict], as_of: datetime) -> pd.DataFrame:
    rows = []
    for f in features:
        props, geometry = f.get("properties") or {}, f.get("geometry") or {}
        coords = geometry.get("coordinates") or []
        if len(coords) < 3:
            continue
        rows.append({
            "id": str(f.get("id", "")), "time": pd.to_datetime(props.get("time"), unit="ms", utc=True, errors="coerce"),
            "magnitude": props.get("mag"), "longitude": coords[0], "latitude": coords[1],
            "depth_km": coords[2], "place": str(props.get("place") or "Unknown region"),
        })
    fields = ["id", "time", "magnitude", "longitude", "latitude", "depth_km", "place"]
    df = pd.DataFrame(rows, columns=fields)
    for col in ["magnitude", "longitude", "latitude", "depth_km"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df.dropna(subset=["time", "magnitude", "longitude", "latitude", "depth_km"], inplace=True)
    df.drop_duplicates(subset="id", keep="last", inplace=True)
    df = df[df["id"].str.len().gt(0)]
    df = df[df["latitude"].between(-90, 90) & df["longitude"].between(-180, 180)]
    df = df[(df["magnitude"] >= MAGNITUDE) & (df["time"] < as_of) &
            (df["time"] >= as_of - timedelta(days=371))]
    return df.sort_values("time").reset_index(drop=True)


def weekly_baseline(df: pd.DataFrame, as_of: datetime) -> dict:
    # Past 53 complete UTC weeks: 52 baseline weeks, 1 recent observation week.
    starts = [as_of - timedelta(days=371 - 7 * i) for i in range(53)]
    amounts = [int(((df.time >= start) & (df.time < start + timedelta(days=7))).sum()) for start in starts]
    baseline = np.asarray(amounts[:-1], dtype=int)
    recent = amounts[-1]
    median = float(np.median(baseline))
    p90 = float(np.percentile(baseline, 90))
    return {
        "recent_7d": recent, "baseline_median_7d": round(median, 1),
        "baseline_p90_7d": round(p90, 1), "baseline_weeks": len(baseline),
        "above_baseline_p90": bool(recent > p90),
        "weekly_series": [{"week_start": st.date().isoformat(), "count": count} for st, count in zip(starts, amounts)],
    }


def cluster_hotspots(df: pd.DataFrame) -> dict:
    """DBSCAN with great-circle distance; M4.5+ past 365 days, spatial only."""
    subset = df[df.time >= (df.time.max() - timedelta(days=365))].copy() if not df.empty else df.copy()
    if len(subset) < MIN_SAMPLES:
        return {"hotspots": [], "noise_count": int(len(subset)), "cluster_count": 0}
    coordinates = np.radians(subset[["latitude", "longitude"]].to_numpy(dtype=float))
    labels = DBSCAN(eps=EPS_KM / EARTH_RADIUS_KM, min_samples=MIN_SAMPLES, metric="haversine", algorithm="ball_tree").fit_predict(coordinates)
    subset["cluster"] = labels
    hotspots = []
    for label, group in subset[subset.cluster >= 0].groupby("cluster"):
        # Circular mean longitude is stable near the International Date Line.
        angles = np.radians(group.longitude.to_numpy(dtype=float))
        lng = np.degrees(np.arctan2(np.sin(angles).mean(), np.cos(angles).mean()))
        hotspots.append({
            "id": int(label), "count": int(len(group)),
            "latitude": round(float(group.latitude.mean()), 3),
            "longitude": round(float(lng), 3),
            "mean_magnitude": round(float(group.magnitude.mean()), 2),
            "max_magnitude": round(float(group.magnitude.max()), 1),
            "mean_depth_km": round(float(group.depth_km.mean()), 1),
            "example_place": str(group.place.mode().iloc[0])[:110],
        })
    hotspots.sort(key=lambda h: h["count"], reverse=True)
    return {"hotspots": hotspots[:12], "noise_count": int((labels == -1).sum()), "cluster_count": len(hotspots)}


def summarize(df: pd.DataFrame, as_of: datetime) -> dict:
    period = df[df.time >= as_of - timedelta(days=365)].copy()
    if period.empty:
        raise ValueError("No real USGS events in the requested period. Refusing to publish empty analytics.")
    recent = period[period.time >= as_of - timedelta(days=30)]
    dates = pd.date_range(as_of - timedelta(days=29), periods=30, freq="D", tz="UTC")
    daily_counts = recent.groupby(recent.time.dt.floor("D")).size().reindex(dates, fill_value=0)
    edges = [4.5, 5.0, 6.0, 7.0, float('inf')]
    bins = pd.cut(period.magnitude, bins=edges, right=False, labels=["4.5–4.9", "5.0–5.9", "6.0–6.9", "7.0+"])
    distribution = bins.value_counts(sort=False)
    weekly = weekly_baseline(df, as_of)
    spatial = cluster_hotspots(period)
    return {
        "version": 1, "status": "ready", "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "source": "USGS FDSN Event Catalog", "source_url": API,
        "methodology": {
            "start_utc": (as_of-timedelta(days=365)).date().isoformat(),
            "end_exclusive_utc": as_of.date().isoformat(),
            "reference_window_days": 365, "baseline_weeks": 52,
            "min_magnitude": MAGNITUDE,
            "clustering": {"algorithm": "DBSCAN", "metric": "haversine", "eps_km": EPS_KM, "min_samples": MIN_SAMPLES},
            "caveat": "Retrospective geographic clusters, not future earthquake locations or hazard assessments. Data can be revised by USGS."
        },
        "summary": {
            "total_events": int(len(period)), "mean_magnitude": round(float(period.magnitude.mean()), 2),
            "max_magnitude": round(float(period.magnitude.max()), 1),
            "median_depth_km": round(float(period.depth_km.median()), 1),
        },
        "daily_last_30d": [{"date": dt.date().isoformat(), "count": int(n)} for dt,n in daily_counts.items()],
        "magnitude_distribution": [{"range": str(idx), "count": int(val)} for idx,val in distribution.items()],
        "weekly_baseline": weekly, "spatial": spatial,
    }


def main() -> None:
    now = datetime.now(timezone.utc)
    as_of = now.replace(hour=0, minute=0, second=0, microsecond=0)
    print(f"Fetching real USGS catalog through {as_of.date().isoformat()} (exclusive)")
    raw = fetch_catalog(as_of)
    df = clean_features(raw, as_of)
    report = summarize(df, as_of)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    dataset_path = OUTPUT.parent / "earthquakes_historical.csv"
    df.loc[df.time >= as_of - timedelta(days=365), ["id", "time", "latitude", "longitude", "depth_km", "magnitude", "place"]].to_csv(dataset_path, index=False)
    temp = OUTPUT.with_suffix('.tmp')
    temp.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(OUTPUT)
    print(f"Saved {len(df):,} validated events to {OUTPUT}")


if __name__ == "__main__":
    main()