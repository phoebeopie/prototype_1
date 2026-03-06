# Discovr 🎵

Find new songs that perfectly match your vibe — powered by Claude AI.

---

## Project Structure

```
discovr/
├── server.js          ← Express backend (Claude API proxy)
├── package.json
├── .gitignore
└── public/
    └── index.html     ← Frontend (served by Express)
```

---

## Deploying to Render — Step by Step

### 1. Get your Anthropic API key
- Go to https://console.anthropic.com
- Click **API Keys** → **Create Key**
- Copy it somewhere safe (you'll need it in step 6)

---

### 2. Put the project on GitHub

If you don't have Git installed, download it at https://git-scm.com

Open a terminal in the `discovr/` folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
```

Then:
- Go to https://github.com and create a **New repository** called `discovr`
- Set it to **Private** (recommended — keeps your code to yourself)
- Copy the remote URL GitHub gives you (looks like `https://github.com/YOURNAME/discovr.git`)

Back in your terminal:

```bash
git remote add origin https://github.com/YOURNAME/discovr.git
git branch -M main
git push -u origin main
```

---

### 3. Create a Render account
- Go to https://render.com and sign up (free)
- Connect your GitHub account when prompted

---

### 4. Create a new Web Service on Render
- Click **New +** → **Web Service**
- Select your `discovr` GitHub repository
- Click **Connect**

---

### 5. Configure the service

Fill in the following settings:

| Setting | Value |
|---|---|
| **Name** | `discovr` (or whatever you like) |
| **Region** | Closest to you |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

---

### 6. Add your API key as an Environment Variable

Scroll down to **Environment Variables** and click **Add Environment Variable**:

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (your key from step 1) |

⚠️ Never put your API key in any code file or commit it to GitHub.

---

### 7. Deploy!
- Click **Create Web Service**
- Render will install dependencies and start your server
- After ~2 minutes you'll see **"Your service is live"**
- Your public URL will be something like: `https://discovr.onrender.com`

---

## Custom Domain (optional)

Once live, you can add a custom domain (e.g. `discovrmusic.com`):
1. Buy a domain at Namecheap or Cloudflare (~$10/yr)
2. In Render → your service → **Settings** → **Custom Domains**
3. Follow the DNS instructions Render gives you

---

## Running Locally

```bash
# Install dependencies
npm install

# Create a local .env file with your API key
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env

# Install dotenv for local dev
npm install dotenv

# Add this line to the TOP of server.js for local use only:
# require('dotenv').config()

# Start the server
npm start

# Open http://localhost:3000
```

> Note: the `require('dotenv').config()` line is only needed locally.
> On Render, environment variables are set through the dashboard.

---

## Notes

- The free Render tier spins down after 15 minutes of inactivity — the first request after that takes ~30 seconds to wake up. Upgrading to a paid tier ($7/mo) keeps it always-on.
- All API calls go through your server — your Anthropic key is never exposed to users.
