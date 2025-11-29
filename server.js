const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.AWESOME_TOKEN || '';

app.use(cors());
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

    // Normaliza chaves sem hífen (ex: "USDBRL") para o formato esperado pelo frontend ("USD-BRL")
    const normalized = {};
    Object.keys(json).forEach(key => {
      if (key.includes('-')) {
        normalized[key] = json[key];
      } else if (key.length > 3) {
        // divide em prefixo (tudo menos os últimos 3 chars) + "-" + últimos 3 chars
        const newKey = key.slice(0, -3) + '-' + key.slice(-3);
        normalized[newKey] = json[key];
      } else {
        normalized[key] = json[key];
      }
    });

    res.json(normalized);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));