# Map background images

Vite copies everything under `public/` into the production `dist/` folder with the same paths. Practice scenarios reference these files as `/assets/img/<filename>`.

Place the following JPEGs in this directory before running `npm run build` (or CI):

- `river_heights_map.jpg`
- `filmore_grove_map.jpg`
- `filmore_city_map.jpg`
- `filmore_springs_map.jpg`
- `high_plains_aquifer_map.jpg`
- `peoria_map.jpg`

They are also listed in `src/features/scenario/practiceScenarios.ts`.

Optional: run `npm run check:map-assets` to verify all files exist locally.
