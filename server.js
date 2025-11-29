const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.AWESOME_TOKEN || '';

app.use(cors()); // opcional, útil se frontend for servido por outro host/porta
app.use(express.static('frontend'));

if (!TOKEN) console.warn('AWESOME_TOKEN não definido em .env — chamadas sem token podem falhar.');

app.get('/api/last/:pairs', async (req, res) => {
  try {
    const pairs = req.params.pairs;
    console.log('Proxy request for:', pairs);
    const url = `https://economia.awesomeapi.com.br/json/last/${pairs}${TOKEN ? `?token=${TOKEN}` : ''}`;
    const r = await fetch(url);
    const text = await r.text();

    if (!r.ok) {
      console.error('AwesomeAPI error', r.status, text);
      return res.status(r.status).send(text);
    }

    const json = JSON.parse(text);
    res.json(json);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));