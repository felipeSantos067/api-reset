import * as movimentacoesService from '../services/movimentacoes.service.js';

export function entradaEstoque(req, res) {
  const { produtoId, quantidade } = req.body;
  if (!produtoId || !quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: "Mande o produtoId e uma quantidade valida!" });
  }

  const produtoAtualizado = movimentacoesService.darEntrada(produtoId, quantidade);
  if (!produtoAtualizado) {
    return res.status(404).json({ erro: "Produto nao existe!" });
  }

  return res.status(201).json({ msg: "Estoque updated!", produto: produtoAtualizado });
}