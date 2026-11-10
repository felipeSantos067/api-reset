import * as vendasService from '../services/vendas.service.js';

export function criarVenda(req, res) {
  const resultado = vendasService.realizarVenda(req.body.itens);
  if (resultado.erro) {
    return res.status(422).json({ erro: resultado.erro });
  }

  return res.status(201).json({ msg: "Venda aprovada!", novaVenda: resultado.dados });
}

export function obterRelatorio(req, res) {
  const relatorio = vendasService.gerarRelatorio();
  return res.json(relatorio);
}
