# TerraPulse — Earthquake Pattern Intelligence

**A bilingual, evidence-first geospatial Data Science product.**

TerraPulse turns real, publicly reported earthquake records into understandable descriptions of **where historical earthquakes cluster** and **how recent global counts compare with past weekly counts**. It is deliberately **not** an earthquake prediction, risk-ranking or emergency alert tool.

## Experience

- **TerraPulse 2.0 preview:** `v2.html` — independent redesigned research explorer, with a story-first homepage, interactive 2D map, interpretable pattern cards, true historical comparison, and responsive Arabic/English UI.
- **Original application:** `index.html` — 3D earthquake explorer and dashboard, currently left intact while the redesign is reviewed.
- **Historical analysis:** `intelligence.html` — more detailed figures, methodology, and historical trends.

### Why this product is different from a basic earthquake map

The user starts with a question rather than a pile of metrics:

1. **Where has recorded activity concentrated?** Choose a retrospective DBSCAN cluster; inspect the record count, mean and maximum magnitude, and mean depth. The map shows representative cluster centers, not exact earthquake epicenters.
2. **How does the last complete week compare?** Contrast the global count of M4.5+ events over 7 complete UTC days with the median and 90th percentile of 52 preceding weekly windows.
3. **How was this conclusion made?** See the preprocessing pipeline, selected DBSCAN parameters and scope/limitations, with the original historical CSV available to download.

This interface uses progressive disclosure: explanations first; advanced details are available when requested.

## Data and analytical integrity

| Aspect | Implementation |
|---|---|
| Data source | USGS FDSN Earthquake Catalog |
| Scope | M4.5+ earthquakes, last 365 completed UTC days |
| Source collection | Python Requests; date-windowed catalog requests |
| Preparation | Pandas: missing values, duplicate event identifiers, coordinates, timestamps |
| Geographic clustering | Scikit-learn DBSCAN with Haversine distance |
| Clustering parameters | Radius 160 km; minimum 6 observations |
| Time comparison | Last 7 completed UTC days vs 52 historical 7-day windows |
| Data delivery | CSV + generated JSON snapshot; daily GitHub Actions pipeline |
| UI | JavaScript, HTML/CSS, Leaflet map, custom SVG chart |
| Responsive and inclusive | Arabic/English, dark/light themes, clickable map and keyboard-accessible cluster list |

**Important interpretation:** clusters only describe where recorded earthquakes were geographically close in the sampled catalog. They do not estimate hazard, future location, timing, or magnitude. Weekly thresholds describe counts, not a safety state. USGS records can change after publication.

A snapshot includes both the **exclusive upper bound** of the historical window and the time at which it was generated. Data is never fabricated in the browser if a fetch fails.

## Architecture

```text
TerraPulse/
├── v2.html                  # Product redesign preview (not default yet)
├── v2.css                   # Design system and responsive layout
├── v2.js                    # Interactions, snapshot validation, accessible map/chart
├── index.html               # Original TerraPulse homepage
├── app.js / styles.css      # Original dashboard and 3D explorer
├── intelligence.html        # Detailed historical analysis
├── scripts/
│   └── build_intelligence.py # USGS -> preprocessing -> DBSCAN -> comparison
├── tests/
│   └── test_analysis.py      # Preprocessing, clustering, time-window checks
├── data/
│   ├── earthquakes_historical.csv # Validated historical catalog
│   └── insights.json             # Generated aggregate report
└── .github/workflows/update-intelligence.yml # Scheduled pipeline
```

The static preview works with GitHub Pages. Leaflet/CARTO map tiles require an internet connection. The list of clusters and computed metrics remains usable if the map library or tiles are unavailable.

## Reproducibility

Install requirements and test the historical pipeline:

```bash
pip install -r requirements.txt
python -m unittest discover -s tests -v
python scripts/build_intelligence.py
```

To preview the site locally, serve the repository root over HTTP (not `file://`) and open `v2.html`.

The build downloads actual earthquake records from USGS. It does not generate synthetic earthquakes and does not publish on source/network failure.

## What I would improve next

- Browser-level mobile Safari QA and automated interaction tests.
- Usability testing with first-time users and iteration based on observed friction.
- Faster historical clustering updates and additional carefully validated spatial summaries.
- A portfolio case study with product screenshots and documented design decisions.

## Sources

- USGS FDSN Earthquake Catalog: https://earthquake.usgs.gov/fdsnws/event/1/
- USGS Earthquake Hazards Program: https://earthquake.usgs.gov/
- USGS statement on earthquake prediction: https://www.usgs.gov/faqs/can-you-predict-earthquakes

**Independent educational / portfolio project. Not affiliated with USGS.**
