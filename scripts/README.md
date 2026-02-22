# Scripts

## Geocoding campus locations (Google)

To get accurate lat/lng for every school campus and write them into the app:

1. **Set your Google API key**  
   Enable the [Geocoding API](https://developers.google.com/maps/documentation/geocoding) in Google Cloud, then add to `.env.local`:
   ```bash
   GOOGLE_GEOCODING_API_KEY=your_key_here
   ```

2. **Extract campus list** (from current `SCHOOL_PROFILES`):
   ```bash
   npx tsx scripts/extract-campus-addresses.ts
   ```
   Writes `scripts/campus-addresses.json`.

3. **Geocode with Google** (requires the key in env):
   ```bash
   node scripts/geocode-campuses.mjs
   ```
   Writes `src/data/campus-coordinates.json`. The app merges these into each profile’s campuses at build time.

After step 3, rebuild the site; school profile maps will use the new coordinates.
