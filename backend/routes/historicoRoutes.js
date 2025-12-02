const express = require("express");
const router = express.Router();
const Historico = require("./models/Historico");

// Salvar
router.post("/", async (req, res) => {
  try {
    const novo = await Historico.create(req.body);
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar histórico" });
  }
});

// Listar
router.get("/", async (req, res) => {
  try {
    const lista = await Historico.find().sort({ _id: -1 });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar histórico" });
  }
});

// Apagar tudo
router.delete("/", async (req, res) => {
  try {
    await Historico.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao limpar histórico" });
  }
});

module.exports = router;
