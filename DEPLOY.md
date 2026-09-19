# Deploying M/S Liton Steel to a public domain

Two supported routes. **Route A (Vercel + Supabase)** needs no server administration and serves
fast worldwide — recommended. **Route B (VPS)** is one rented Linux box, no Supabase, but you
maintain it yourself.

---

## Route A — Vercel + Supabase (recommended)

### Step 1. Put the code on GitHub (~10 min)

Create an empty **private** repository at github.com (no README, no .gitignore), then from the
project folder:

```bash
cd ~/ZCodeProject/liton-steel
git add -A
git commit -m "Liton Steel website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Keep the repository **private**: it contains the site content and the company profile PDF.

### Step 2. Create the database (~10 min)

The site stores its pages, projects and uploaded photos in Supabase, because Vercel's own
filesystem is read-only.

1. Sign up at supabase.com and create a project. **Choose the Singapore region** — it is the
   closest to Bangladesh.
2. Save the database password it gives you.
3. Open **SQL Editor**, paste the entire contents of `supabase/migrations/001_init.sql` from this
   project, and press Run. This creates the tables and the public `media` storage bucket.
4. Open **Project Settings → API** and copy three values:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### Step 3. Deploy to Vercel (~10 min)

1. Sign up at vercel.com with your GitHub account.
2. **Add New → Project**, import the repository. Leave the build settings untouched — Next.js is
   detected automatically.
3. Before clicking Deploy, open **Environment Variables** and add:

| Name | Value |
|---|---|
| `AUTH_SECRET` | `9uQyOkfJAIGNDPyiTHaMBzZxhpCa8O4EnE-biqVKnsc` |
| `ADMIN_PASSWORD` | a strong password you choose (this logs into /admin) |
| `DATA_BACKEND` | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from step 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key from step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key from step 2 |
| `SUPABASE_MEDIA_BUCKET` | `media` |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` (fill in after step 4; redeploy once set) |

4. Deploy. The first build seeds the database with all the pages, the 18 projects and the 68
   photos. You get a working `....vercel.app` address immediately.

### Step 4. Connect your domain (~15 min + DNS wait)

1. Buy a domain — Namecheap, Cloudflare or GoDaddy for `.com` (about $10–15/year), or BTCL for a
   `.com.bd`.
2. In Vercel: **Project → Settings → Domains → Add**, type your domain.
3. Vercel shows the DNS records to create. At your registrar's DNS page, add them:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
4. Wait for propagation (usually minutes, up to 24 hours). HTTPS is issued automatically.
5. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` address and redeploy, so the sitemap,
   Google structured data and social preview images use the right address.

### Cost

- Domain: ~$10–15 per year.
- Supabase free tier: enough for this site (500 MB database, 1 GB file storage).
- Vercel Hobby: free, but Vercel's terms reserve commercial use for the **Pro** plan ($20/month).
  Fine for testing; budget for Pro once it is the company's live site.

### Updating the site afterwards

Content changes are made in the editor at `https://<your-domain>/admin` and go live when you press
Publish — no redeploy needed. Code changes go live when you `git push`.

---

## Route B — Your own VPS (~$5/month, no Supabase)

Suitable if you prefer one server and no third-party database. The local JSON backend works here,
so uploads and content save straight to disk.

1. Rent a small Ubuntu server (Hetzner, DigitalOcean or Vultr — pick Singapore). 1 GB RAM is enough.
2. Point your domain's `A` record at the server's IP address.
3. On the server:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx git
git clone https://github.com/<your-username>/<your-repo>.git /var/www/liton
cd /var/www/liton && npm ci && cp .env.example .env.local
# edit .env.local: set AUTH_SECRET, ADMIN_PASSWORD, NEXT_PUBLIC_SITE_URL; leave DATA_BACKEND=local
npm run build
sudo npm i -g pm2 && pm2 start "npm start" --name liton && pm2 save && pm2 startup
```

4. Point nginx at `http://localhost:3000` as a reverse proxy, then run
   `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com` for HTTPS.
5. Back up `/var/www/liton/data` and `/var/www/liton/public/uploads` regularly — that is all the
   site content.

---

## Before going live (both routes)

- [ ] Change `ADMIN_PASSWORD` from the development value.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy.
- [ ] Optional: `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` so the contact form emails
      liton.steel.kst@gmail.com. Without them, messages are still saved and readable in the database.
- [ ] Optional: Cloudflare Turnstile keys to block contact-form spam.
- [ ] Optional: `ADMIN_TOTP_SECRET` to require a 6-digit code at login.
- [ ] Replace the hero photo with a full-resolution original (the PDF copies are only 864 px wide).
- [ ] Submit the domain to Google Search Console; the sitemap is at `/sitemap.xml`.
