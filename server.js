const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const Historico = require('./historico'); // <-- Correção

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.AWESOME_TOKEN || '';

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// -------------------------------------------------------
// 🔌 Conexão MongoDB
// -------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado ✔"))
  .catch(err => console.error("Erro no MongoDB:", err));

// -------------------------------------------------------
// Aviso caso não exista token
// -------------------------------------------------------
if (!TOKEN) console.warn('AWESOME_TOKEN não definido no .env — chamadas sem token podem falhar.');


// ====================================================================
// 🟦 ROTAS DE HISTÓRICO
// ====================================================================

// Salvar um item no histórico
app.post('/historico', async (req, res) => {
  try {
    const novo = await Historico.create(req.body);
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar histórico no banco." });
  }
});

// Listar tudo
app.get('/historico', async (req, res) => {
  try {
    const lista = await Historico.find().sort({ _id: -1 });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar histórico." });
  }
});

// Limpar tudo
app.delete('/historico', async (req, res) => {
  try {
    await Historico.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao limpar histórico." });
  }
});


// ====================================================================
// 🔹 Proxy para AwesomeAPI
// ====================================================================
app.get('/api/last/:pairs', async (req, res) => {
  try {
    const pairs = req.params.pairs;
    console.log('Proxy request para:', pairs);

    const url = `https://economia.awesomeapi.com.br/json/last/${pairs}${TOKEN ? `?token=${TOKEN}` : ''}`;

    const r = await fetch(url);
    const text = await r.text();

    if (!r.ok) {
      console.error('Erro na AwesomeAPI:', r.status, text);
      return res.status(r.status).send(text);
    }

    const json = JSON.parse(text);

    // normalização das chaves
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

    res.json(normalized);

  } catch (err) {
    console.error('Erro no proxy:', err);
    res.status(500).json({ error: err.message });
  }
});


// -------------------------------------------------------
// 🚀 Iniciar Servidor
// -------------------------------------------------------
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
