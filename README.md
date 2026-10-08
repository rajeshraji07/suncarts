# SunCart

Front-end prototype for an integrated social commerce and surplus food redistribution platform.

## Files

- `index.html`  page structure
- `style.css`   all styling, light and dark theme tokens at the top
- `script.js`   shop, cart, order tracking, donation matcher, centers, chart, role dashboards
- `images/`     food photos (WebP). See `images/README.txt` to replace them

## Run it

Open `index.html` in a browser. No build step. Fonts load from Google Fonts when online.
For a local server: `npx serve .` or `python3 -m http.server`.

## Where to connect the backend

All data is sample data at the top of `script.js`:

- `PRODUCTS`, `centers`, `donations`, `orders`  replace with calls to your Node.js and Express API (MongoDB)
- `match()`  the center ranking; swap for your AI service (demand prediction, redistribution, route optimization)
- Sign-in is not included yet. Add Firebase Authentication or JWT before the role dashboards.

## FoodBridge update (added on top, nothing existing was changed)

New files: `foodbridge.css` and `foodbridge.js`. `index.html` only gained one `<link>` and one `<script>` line; `script.js` and `style.css` are unchanged. The new sections are inserted above "A dashboard for every role" and four links are added to the header nav.

- **Food posts**: Veg / Non-Veg, category, name, quantity, servings, prepared / safe-until / pickup time, image, location. Veg and Non-Veg are listed in separate labelled groups with a shared filter.
- **Requirements**: institutes post food type, meals, people, adults / children, time, location, urgency. Each card shows suitable donations.
- **Smart matching and AI score**: `score()`, `allocate()` in `foodbridge.js`. Weights: quantity 25%, distance 20%, safe time left 20%, pickup deadline 15%, urgency 20%. Food type and "arrives in time" are hard requirements. One donation is split across several institutes.
- **Map**: schematic map on the same grid as the existing one (1 unit = 0.3 km). Layers, 1 / 3 / 5 / 10 km radius, search, details panel, Navigate button (opens Google Maps directions to the address).
- **Urgent alerts**: food within 60 minutes of its safe limit (or marked urgent) raises an alert and lists the institutes and volunteers notified.
- **Routes**: `plan()` picks the shortest order of volunteer, donor, Sun Cart Center, institutes and draws it on the map.
- **Dashboards**: Donor, Institute / NGO and Admin tabs in a separate "FoodBridge dashboards" section.

Backend hooks: replace `SRC`, `INST`, `CENTERS`, `VOL`, `posts`, `reqs` with API calls, `score()` with your AI service, and `eta()` / `dist()` with a real routing API. FoodBridge data is kept separate from the existing SunCart sample data, so existing counters and dashboards behave as before.
