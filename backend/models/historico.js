const mongoose = require("mongoose");

const HistoricoSchema = new mongoose.Schema({
  valor: Number,
  moeda: String,
  resultado: String,
  taxa: String,
  data: String
});

module.exports = mongoose.model("Historico", HistoricoSchema);