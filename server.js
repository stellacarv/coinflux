const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.AWESOME_TOKEN || '';

if (!TOKEN) console.warn('AWESOME_TOKEN não definido em .env — chamadas sem token podem falhar.');

app.use(express.static('frontend')); // serve o seu frontend diretamente

// Proxy simples: /api/last/USD-BRL or /api/last/USD-BRL,EUR-BRL
app.get('/api/last/:pairs', async (req, res) => {
  try {
    const pairs = req.params.pairs;
    const url = `https://economia.awesomeapi.com.br/json/last/${pairs}${TOKEN ? `?token=${TOKEN}` : ''}`;
    const r = await fetch(url);
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));