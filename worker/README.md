# Cloudflare Worker Setup Guide

This guide explains how to set up the Cloudflare Worker for handling form submissions with SendGrid email integration and dual CAPTCHA protection (Turnstile + reCAPTCHA).

## Prerequisites

1. **Cloudflare Account**: [Sign up here](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**: Install globally
   ```bash
   npm install -g wrangler
   ```
3. **SendGrid Account**: [Sign up here](https://signup.sendgrid.com/)
4. **Turnstile Site Key**: [Get from Cloudflare](https://dash.cloudflare.com/turnstile)
5. **reCAPTCHA Keys**: [Get from Google](https://www.google.com/recaptcha/admin)

## Step 1: Setup SendGrid

1. Log in to your SendGrid account
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Give it a name (e.g., "Caliu Benchmark Worker")
5. Select **Full Access** or **Restricted Access** with Mail Send permissions
6. Copy the API key (you'll need this later)
7. Verify a sender email address under **Settings** → **Sender Authentication**

## Step 2: Setup Cloudflare Turnstile

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Turnstile** in the sidebar
3. Click **Add Site**
4. Configure:
   - **Site Name**: Caliu Benchmark
   - **Domain**: Your domain (e.g., caliudata.com) or `localhost` for testing
   - **Widget Mode**: Managed
5. Save and copy both:
   - **Site Key** (public, for frontend)
   - **Secret Key** (private, for worker)

## Step 3: Setup Google reCAPTCHA

Your site key is already configured: `6LehhuArAAAAAFBchjF4arrm3dq-3WpdFEvz5yV4`

If you need to get the secret key:
1. Go to [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Find your site or create a new one
3. Copy the **Secret Key**

## Step 4: Configure Environment Variables

### Option A: Using Wrangler CLI (Recommended)

Navigate to the project directory and set the secrets:

```bash
cd caliu-app/stream-benchmark

# Authenticate with Cloudflare
wrangler login

# Set the secrets
wrangler secret put SENDGRID_API_KEY
# Paste your SendGrid API key when prompted

wrangler secret put TO_EMAIL
# Enter the email where you want to receive leads (e.g., leads@caliudata.com)

wrangler secret put FROM_EMAIL
# Enter the verified sender email from SendGrid (e.g., info@caliudata.com)

wrangler secret put TURNSTILE_SECRET_KEY
# Paste your Turnstile secret key when prompted

wrangler secret put RECAPTCHA_SECRET_KEY
# Paste your reCAPTCHA secret key when prompted
```

### Option B: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Select your worker
4. Go to **Settings** → **Variables**
5. Add the following as **Environment Variables** (encrypted):
   - `SENDGRID_API_KEY`
   - `TO_EMAIL`
   - `FROM_EMAIL`
   - `TURNSTILE_SECRET_KEY`
   - `RECAPTCHA_SECRET_KEY`

## Step 5: Update Frontend Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your values:
   ```env
   VITE_WORKER_URL=https://your-worker-name.your-subdomain.workers.dev
   VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
   ```

3. Update `src/App.jsx` line 738 with your Turnstile site key:
   ```javascript
   sitekey: 'YOUR_TURNSTILE_SITE_KEY', // Replace with your actual site key
   ```

## Step 6: Deploy the Worker

1. Make sure you're in the project directory:
   ```bash
   cd caliu-app/stream-benchmark
   ```

2. Deploy to Cloudflare:
   ```bash
   wrangler deploy
   ```

3. After deployment, you'll get a worker URL like:
   ```
   https://caliu-benchmark-worker.your-subdomain.workers.dev
   ```

4. Copy this URL and update your `.env.local`:
   ```env
   VITE_WORKER_URL=https://caliu-benchmark-worker.your-subdomain.workers.dev
   ```

## Step 7: Update CORS Settings (Production)

For production, update the CORS settings in `worker/index.js`:

```javascript
const securityHeaders = {
  'Access-Control-Allow-Origin': 'https://caliudata.com', // Your actual domain
  // ... rest of headers
};
```

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application and trigger the lead capture popup
3. Fill in the form
4. Complete the Turnstile challenge
5. Submit the form
6. Check your email (TO_EMAIL) for the lead notification

## Environment Variables Reference

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `SENDGRID_API_KEY` | Secret | SendGrid API key | `SG.xxxxxxxxxxxxx...` |
| `TO_EMAIL` | Secret | Recipient email for leads | `leads@caliudata.com` |
| `FROM_EMAIL` | Secret | Verified sender email | `info@caliudata.com` |
| `TURNSTILE_SECRET_KEY` | Secret | Cloudflare Turnstile secret | `0x4AAAAAAAxxxx...` |
| `RECAPTCHA_SECRET_KEY` | Secret | Google reCAPTCHA v3 secret | `6LehhuArxxxxxxxxxx...` |
| `VITE_WORKER_URL` | Frontend | Deployed worker URL | `https://...workers.dev` |
| `VITE_TURNSTILE_SITE_KEY` | Frontend | Turnstile site key (public) | `0x4AAAAAAAxxxx...` |

## Troubleshooting

### Worker not receiving requests
- Check CORS settings in `worker/index.js`
- Verify the worker URL in `.env.local`
- Check browser console for errors

### SendGrid not sending emails
- Verify your SendGrid API key has Mail Send permissions
- Confirm `FROM_EMAIL` is verified in SendGrid
- Check worker logs: `wrangler tail`

### Turnstile/reCAPTCHA validation failing
- Verify secret keys are set correctly
- Check domain matches in Turnstile dashboard
- Ensure scripts are loaded (check browser console)

### View Worker Logs
```bash
wrangler tail
```

## Security Notes

1. **Never commit secrets** to version control
2. Use environment variables for all sensitive data
3. Update CORS settings for production
4. Both Turnstile and reCAPTCHA provide dual protection
5. Consider adding rate limiting for production use

## Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [SendGrid API Docs](https://docs.sendgrid.com/api-reference/mail-send/mail-send)
- [Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [reCAPTCHA v3 Docs](https://developers.google.com/recaptcha/docs/v3)

