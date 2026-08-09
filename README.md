# SCN Football Tracker

A one-page rankings dashboard for **St. Charles North North Stars** football — MaxPreps rankings, On3 rankings, and DuKane Conference standings on a single screen.

Static site: no build step, no dependencies.

## Updating during the season

Everything on the page comes from [`data.json`](data.json). Edit that one file, commit, and the site updates.

```jsonc
"sources": {
  "maxpreps": {
    "rankings": [
      { "label": "National", "value": 412 },   // number  -> renders "#412"
      { "label": "Illinois", "value": 18 },
      { "label": "Class 7A", "value": "T-4" }  // string  -> renders as-is
    ],
    "note": "Updated after Week 3."
  }
}
```

- `value: null` renders an em dash (—) for anything not published yet.
- `record.overall` and `lastUpdated` show in the header and footer.
- In `dukane.standings`, list teams in standings order — the rank column numbers them automatically, and the St. Charles North row highlights itself.

Where to pull the numbers each week:

| Section | Source |
| --- | --- |
| MaxPreps | https://www.maxpreps.com/il/st-charles/st-charles-north-north-stars/football/ |
| On3 | https://www.on3.com/high-school/st-charles-north-saint-charles-il-11399/football/schedule/ |
| DuKane standings | https://www.si.com/high-school/stats/illinois/football/leagues/9147-dukane |

## Images

| File | What it is |
| --- | --- |
| `assets/banner.jpg` | Hero banner. If missing, a CSS stand-in renders instead. |
| `assets/logos/maxpreps.png` | Optional. Falls back to a styled text wordmark. |
| `assets/logos/on3.png` | Optional. Same fallback. |
| `assets/logos/dukane.png` | Optional. Same fallback. |

Drop a file in and it appears on next load — no code changes needed. `.svg` also works; update the `data-logo` path in `index.html` if you use a different extension.

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. A server is required — `data.json` is loaded via `fetch`, which browsers block on `file://`.

---

Unofficial, fan-made. MaxPreps, On3, and the DuKane Conference are trademarks of their respective owners.
