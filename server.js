const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Claude proxy ──────────────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { title, artist } = req.body;
  if (!title || !artist) {
    return res.status(400).json({ error: 'title and artist are required.' });
  }

  const systemPrompt = `You are a music data expert. Return ONLY a valid JSON object — no markdown, no code fences.

Schema:
{
  "source": {
    "mood_adjectives": ["w1","w2","w3"],
    "danceability": <0-100>,
    "energy": <0-100>,
    "dynamics": "<one sentence>",
    "rhythm": "<one sentence>",
    "release_year": "<year>",
    "genre": "<genre>",
    "bpm": "<number>",
    "key": "<key>",
    "pitch_hz": "<Hz>",
    "time_signature": "<sig>",
    "song_structure": "<structure>",
    "language": "<language>",
    "instruments": "<comma-separated>",
    "data_confidence": "<High|Medium|Low>"
  },
  "recommendations": [
    {
      "title": "<title>",
      "artist": "<artist>",
      "mood_adjectives": ["w1","w2","w3"],
      "danceability": <0-100>,
      "energy": <0-100>,
      "dynamics": "<one sentence>",
      "rhythm": "<one sentence>",
      "release_year": "<year>",
      "genre": "<genre>",
      "bpm": "<number>",
      "key": "<key>",
      "pitch_hz": "<Hz>",
      "time_signature": "<sig>",
      "song_structure": "<structure>",
      "language": "<language>",
      "instruments": "<instruments>",
      "data_confidence": "<High|Medium|Low>",
      "match": {
        "overall": <0-100>,
        "mood": <0-100>,
        "danceability": <0-100>,
        "energy": <0-100>,
        "genre": <0-100>,
        "tempo": <0-100>
      }
    }
  ]
}

- Return exactly 10 recommendations sorted by match.overall descending.
- match.overall = weighted: mood 25%, danceability 20%, energy 20%, genre 20%, tempo 15%.
- Make scores realistic and varied.
- Pick real, genuinely similar songs.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Song: "${title}" by ${artist}` }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: 'Upstream API error. Please try again.' });
    }

    const data   = await response.json();
    const raw    = data.content?.find(b => b.type === 'text')?.text || '';
    const clean  = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ── Catch-all: serve frontend ─────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Discovr running on port ${PORT}`);
});
