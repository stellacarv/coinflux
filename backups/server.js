// server.js - proxy adaptado ao frontend do seu projeto
const express = require('express');
const fetch = require('node-fetch'); // versão 2.x
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.AWESOME_TOKEN || '';

app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // serve index.html, coin.js, assets/ a partir de /frontend

if (!TOKEN) console.warn('AWESOME_TOKEN não definido em .env — chamadas sem token podem falhar.');

const cache = new Map(); // key => { ts, data }
const CACHE_TTL_MS = 15 * 1000; // 15s (ajuste se quiser)

// helper fetch com cache simples
async function fetchWithCache(url) {
  const key = url;
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && (now - entry.ts) < CACHE_TTL_MS) {
    return entry.data;
  }
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) {
    const err = new Error(`Remote ${r.status} ${text}`);
    err.status = r.status;
    throw err;
  }
  let data;
  try { data = JSON.parse(text); } catch (e) { data = text; }
  cache.set(key, { ts: now, data });
  return data;
}

// Normaliza chaves (ex: USDBRL -> USD-BRL)
function normalizeLastResponse(json) {
  const normalized = {};
  Object.keys(json).forEach(key => {
    if (key.includes('-')) {
      normalized[key] = json[key];
    } else if (key.length > 3) {
      const newKey = key.slice(0, -3) + '-' + key.slice(-3);
      normalized[newKey] = json[key];
    } else {
      normalized[key] = json[key];
    }
  });
  return normalized;
}

// Rota: /api/last/:pairs   (ex: /api/last/USD-BRL,EUR-BRL)
app.get('/api/last/:pairs', async (req, res) => {
  try {
    const pairs = req.params.pairs;
    const url = `https://economia.awesomeapi.com.br/json/last/${pairs}${TOKEN ? `?token=${TOKEN}` : ''}`;
    console.log('Proxy /api/last ->', url);
    const json = await fetchWithCache(url);
    res.json(normalizeLastResponse(json));
  } catch (err) {
    console.error('Erro /api/last:', err);
    res.status(err.status || 500).json({ error: err.message || 'Erro no proxy' });
  }
});

// Rota: /api/daily/:pair/:days   (ex: /api/daily/USD-BRL/30)
app.get('/api/daily/:pair/:days?', async (req, res) => {
  try {
    const pair = req.params.pair; // formato esperado exemplo: USD-BRL ou USDBRL
    const days = req.params.days || '30';
    // Normaliza para o formato sem hífen exigido pela API (ex: USDBRL)
    const normalizedPair = pair.includes('-') ? pair.replace('-', '') : pair;
    const url = `https://economia.awesomeapi.com.br/json/daily/${normalizedPair}/${days}${TOKEN ? `?token=${TOKEN}` : ''}`;
    console.log('Proxy /api/daily ->', url);
    const json = await fetchWithCache(url);
    res.json(json);
  } catch (err) {
    console.error('Erro /api/daily:', err);
    res.status(err.status || 500).json({ error: err.message || 'Erro no proxy' });
  }
});

// Health-check
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));
