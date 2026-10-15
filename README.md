# TerraPulse — Earth Intelligence

TerraPulse is a bilingual (English / Arabic), responsive earth-monitoring web application that visualizes **real, recently reported earthquakes** on a 3D globe, using the official USGS GeoJSON feed.

## What works in the first version

- Interactive 3D globe with locations of recent earthquakes (Globe.gl / Three.js).
- USGS data feed for the past 24 hours, 7 days, or 30 days, selectable at **M2.5+** and **M4.5+**.
- Click earthquake points or event rows for the recorded magnitude, depth, coordinates and USGS link.
- Descriptive analytics: total events, mean and maximum magnitude, temporal counts, magnitude distribution.
- Compare the most recent 24 hours with the preceding 24 hours, using the 7-day feed.
- Search locations, export filtered earthquake events to CSV, and use **Print → Save as PDF** for a report.
- Complete Arabic/English UI toggle, dark/light mode, mobile layout.
- Real-time feed connection state, retries and an error message if data cannot be loaded — **no fabricated fallback data**.

## Quick start

No build, server infrastructure, API keys or npm install is required.

1. Unzip the project.
2. From the folder containing `index.html`, run:

   ```bash
   python -m http.server 8000
   ```

3. Open http://localhost:8000 in Chrome, Firefox, Safari or Edge.

You may also open `index.html` directly, but a local HTTP server is more dependable for browser fetch security rules.

Internet access is required for USGS data, the Globe.gl and Chart.js libraries, the globe texture and the optional web fonts.

## Hosting on GitHub Pages

1. Create a repository (e.g. `terrapulse`).
2. Upload `index.html`, `styles.css`, `app.js`, and the `assets` directory to the repository root.
3. In **Settings → Pages**, set **Deploy from a branch → main → /(root)** and save.
4. Open the Pages URL GitHub displays.

This is a static site; GitHub Pages is sufficient for version 1. No Python backend is necessary yet.

## Project architecture

```
TerraPulse/
├── index.html          # App shell, CDN resources
├── styles.css          # Visual system and responsive styles
├── app.js              # State, translation, USGS fetch, globe, charts, exports
├── assets/
│   └── favicon.svg     # Brand mark
└── README.md
```

## Accuracy and limits

- Events originate from the [USGS official GeoJSON summary feeds](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).
- Feeds are updated by USGS frequently, but this site **does not claim a continuous real-time stream or a safety alert service**.
- All amounts and charts are derived from whichever feed successfully loads. The program does not invent earthquake observations.
- Events are filtered by USGS time windows and minimum magnitudes. Figures will differ depending on filter selections and feed updates.
- On the globe, rendering is capped at 650 points for performance. The dataset counts, analytics, search and CSV are calculated from the full filtered list.
- 24-hour comparison is between equal rolling 24-hour windows, using the **7-day** USGS feed rather than an arbitrary date-based chart.
- Report exports contain observational information and should not be used as emergency guidance or predictions.
- Geographic place names come from USGS in the language they are supplied (typically English) even when the interface is Arabic.

## Next development milestones

**v0.2:** Map-based geographic filtering, selectable country/region, accessible data table, automated tests.

**v0.3:** NASA EONET natural event feeds (with event type filters and accurate timestamp handling), more analytics, data quality indicators.

**v0.4:** Optional Python backend, caching, analyst workspaces, and deeper scientific statistical analysis. Avoid unsupported disaster forecasts.

## Attribution

Earthquake data provided by the United States Geological Survey (USGS).
3D globe: [Globe.gl](https://globe.gl/). Charts: [Chart.js](https://www.chartjs.org/).

The platform is an independent portfolio project, not an official USGS service.
