# Where to Upload robots.txt and sitemap.xml on GoDaddy cPanel

Your site is deployed on **GoDaddy cPanel**. Upload both files so they are served at the **root** of your domain.

---

## Option A: File Manager (easiest)

1. **Log in to GoDaddy** → My Products → find your hosting → **cPanel Admin** (or "Manage" then cPanel).

2. **Open File Manager**  
   In cPanel, click **File Manager**.

3. **Go to the site root**  
   - Open the folder that is your **document root** (where the live site is served from).  
   - Common names: `public_html`, `www`, or a subfolder like `public_html/arboreal` if the site is in a subfolder.  
   - If you’re not sure: look for where `index.html` (or your built app’s files) currently live — that folder is the root.

4. **Upload the two files into that root folder**  
   - Click **Upload**.  
   - Upload:
     - `robots.txt`
     - `sitemap.xml`
   - They must sit **in the same folder as your main `index.html`** (or where your app’s entry point is), not inside a subfolder.

5. **Check URLs**  
   After upload, these should open in the browser:
   - `https://thearborealresort.com/robots.txt`
   - `https://thearborealresort.com/sitemap.xml`

---

## Option B: You deploy via Git / build (Vite/React)

If you **build** the app (e.g. `npm run build`) and then upload the **build output** to cPanel:

1. **Keep files in your repo**  
   The repo already has:
   - `arboreal-new-frontend/public/robots.txt`
   - `arboreal-new-frontend/public/sitemap.xml`

2. **Build**  
   Run `npm run build` in `arboreal-new-frontend`.  
   Vite copies everything from `public/` to the root of the build output (e.g. `dist/`).

3. **Upload the build**  
   Upload the **entire contents** of the build folder (e.g. `dist/`) to your cPanel **document root** (e.g. `public_html`).  
   That will include `robots.txt` and `sitemap.xml` at the root.

4. **Verify**  
   - `https://thearborealresort.com/robots.txt`  
   - `https://thearborealresort.com/sitemap.xml`

---

## Summary

| File        | Upload to (cPanel)     | Final URL |
|------------|------------------------|-----------|
| robots.txt | Document root (e.g. public_html) | https://thearborealresort.com/robots.txt |
| sitemap.xml| Document root (e.g. public_html) | https://thearborealresort.com/sitemap.xml |

**Important:** Both files must be in the **same directory** as your site’s main `index.html` (or equivalent). If the site lives in `public_html/arboreal`, put both files inside `public_html/arboreal`, not only in `public_html`.

After uploading, run the SEO survey again; the robots.txt and XML sitemap warnings should clear.
