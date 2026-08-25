# InsightFlow — Business Analytics Dashboard

InsightFlow is a small full-stack analytics dashboard built around a practical business reporting use case. The backend reads the source dataset, applies the selected date/category filters and returns the calculated metrics. The frontend turns that response into a responsive dashboard with charts, KPI cards and recent activity.

## What is included
- 4 KPI cards: revenue, orders, average order value and top category
- Revenue trend line chart
- Revenue-by-category bar chart
- Category mix doughnut chart
- Date range filter
- Category filter
- Backend API with server-side filtering and aggregation
- Responsive desktop/tablet/mobile UI
- Recent activity table using the filtered results

## Tech stack
- Frontend: HTML, CSS, JavaScript
- Charts: Chart.js
- Backend: Node.js built-in HTTP server
- Data: JSON

## Run
Requires Node.js 18+.

```bash
node server.js
```

Open: `http://localhost:5000`

The dashboard is intentionally dependency-light, so there is no `npm install` step. Chart.js is loaded in the browser from its public CDN.

## API
`GET /api/dashboard?from=2026-01-01&to=2026-08-31&category=All`

The response contains filtered records and server-side aggregates used by the visualizations.
