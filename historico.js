const mongoose = require('mongoose');

const HistoricoSchema = new mongoose.Schema({
  moeda: { type: String, required: true },     // Ex: USD-BRL
  valor: { type: Number, required: true },     // Ex: 5.25
  descricao: { type: String },                 // opcional
  criado_em: { type: Date, default: Date.now }
}, {
  versionKey: false
});

module.exports = mongoose.model('Historico', HistoricoSchema);
