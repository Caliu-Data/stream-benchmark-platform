# Email & CAPTCHA Integration Setup Guide

## Overview

This application now includes:
- ✅ **Cloudflare Worker** for secure form submission
- ✅ **SendGrid** email integration for lead notifications
- ✅ **Dual CAPTCHA protection** (Turnstile + reCAPTCHA)
- ✅ **Environment variable management** for secure configuration

## Quick Start

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Get Your API Keys

You'll need the following:

#### SendGrid
1. Go to https://signup.sendgrid.com/
2. Create an account and verify your email
3. Navigate to **Settings** → **API Keys** → **Create API Key**
4. Save the API key securely

#### Cloudflare Turnstile
1. Go to https://dash.cloudflare.com/
2. Navigate to **Turnstile**
3. Click **Add Site**
4. Note both **Site Key** (public) and **Secret Key** (private)

#### Google reCAPTCHA
- Site Key: `6LehhuArAAAAAFBchjF4arrm3dq-3WpdFEvz5yV4` (already configured)
- Get Secret Key from: https://www.google.com/recaptcha/admin

### 3. Configure Secrets

Navigate to your project:
```bash
cd caliu-app/stream-benchmark
```

Login to Cloudflare:
```bash
wrangler login
```

Set all required secrets:
```bash
# SendGrid API Key
wrangler secret put SENDGRID_API_KEY

# Email addresses
wrangler secret put TO_EMAIL
wrangler secret put FROM_EMAIL

# CAPTCHA secrets
wrangler secret put TURNSTILE_SECRET_KEY
wrangler secret put RECAPTCHA_SECRET_KEY
```

### 4. Update Frontend Configuration

Copy the environment template:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_WORKER_URL=https://your-worker.workers.dev
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

Update `src/App.jsx` at line 738:
```javascript
sitekey: 'YOUR_TURNSTILE_SITE_KEY', // Replace with actual key
```

### 5. Deploy Worker

```bash
wrangler deploy
```

Copy the deployed worker URL and update `.env.local`

### 6. Test

```bash
npm run dev
```

Open the app, trigger the lead popup, and submit!

## File Structure

```
caliu-app/stream-benchmark/
├── worker/
│   ├── index.js          # Main worker with CAPTCHA validation
│   ├── email.js          # SendGrid email sending
│   └── README.md         # Detailed worker documentation
├── src/
│   └── App.jsx           # Updated with CAPTCHA integration
├── index.html            # Added reCAPTCHA & Turnstile scripts
├── wrangler.toml         # Worker configuration
├── .env.example          # Environment template
└── SETUP_GUIDE.md        # This file
```

## What Was Changed

### 1. `index.html`
- Added Google reCAPTCHA script
- Added Cloudflare Turnstile script

### 2. `src/App.jsx`
- Added state for CAPTCHA tokens and submission status
- Updated `handleLeadSubmit` to:
  - Get reCAPTCHA token programmatically
  - Get Turnstile token from widget
  - Send data to Cloudflare Worker
  - Handle errors gracefully
- Added Turnstile widget to the form
- Added submit button disabled states
- Added `useEffect` to initialize Turnstile

### 3. `worker/index.js` (NEW)
- Handles form submission
- Validates both Turnstile and reCAPTCHA tokens
- Calls SendGrid email function
- Includes security headers and CORS

### 4. `worker/email.js` (NEW)
- SendGrid API integration
- HTML email template with lead data
- Includes UTM tracking information

### 5. `wrangler.toml` (NEW)
- Worker configuration
- Environment variable placeholders

## Environment Variables

### Worker (Cloudflare Secrets)
| Variable | Description |
|----------|-------------|
| `SENDGRID_API_KEY` | SendGrid API key with Mail Send permission |
| `TO_EMAIL` | Where to send lead notifications |
| `FROM_EMAIL` | Verified sender email in SendGrid |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret key |

### Frontend (`.env.local`)
| Variable | Description |
|----------|-------------|
| `VITE_WORKER_URL` | Your deployed Cloudflare Worker URL |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile public site key |

## Security Features

1. **Dual CAPTCHA Protection**
   - Turnstile (visible widget)
   - reCAPTCHA v3 (invisible, score-based)

2. **Server-Side Validation**
   - Both tokens validated on worker
   - reCAPTCHA score threshold: 0.5

3. **CORS Protection**
   - Configurable allowed origins
   - Secure headers enabled

4. **Environment Variables**
   - All secrets encrypted
   - Never committed to git

## Troubleshooting

### Form won't submit
- Check browser console for errors
- Verify Turnstile widget loaded
- Ensure `.env.local` has correct `VITE_WORKER_URL`

### Not receiving emails
- Verify SendGrid API key
- Check `FROM_EMAIL` is verified in SendGrid
- View worker logs: `wrangler tail`

### CAPTCHA validation fails
- Verify secret keys match site keys
- Check domain configuration in Turnstile dashboard
- Ensure reCAPTCHA score > 0.5

## Additional Commands

```bash
# View worker logs
wrangler tail

# Deploy worker
npm run deploy:worker

# Update a secret
wrangler secret put SECRET_NAME

# List secrets
wrangler secret list
```

## Production Checklist

- [ ] Update CORS origin in `worker/index.js` to your domain
- [ ] Verify all environment variables are set
- [ ] Test form submission end-to-end
- [ ] Verify emails arrive with correct formatting
- [ ] Add rate limiting (optional)
- [ ] Monitor worker logs for errors

## Support

For detailed information, see:
- `worker/README.md` - Comprehensive worker documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [SendGrid API Docs](https://docs.sendgrid.com/)

---

**Note**: Make sure to replace placeholder values with your actual API keys and URLs before deploying to production!

