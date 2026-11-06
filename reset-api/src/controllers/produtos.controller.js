import * as produtoService from '../services/produtos.service.js';

export function listarTodos(req, res) {
  const produtos = produtoService.listar(req.query.categoria);
  return res.json(produtos);
}

export function listarBaixoEstoque(req, res) {
  return res.json(produtoService.listarEstoqueBaixo());
}

export function buscarPorId(req, res) {
  const produto = produtoService.buscarPorId(parseInt(req.params.id));
  if (!produto) return res.status(404).json({ erro: "Produto nao encontrado!" });
  return res.json(produto);
}

export function criar(req, res) {
  const novo = produtoService.cadastrar(req.body);
  return res.status(201).json(novo);
}

export function entradaEstoque(req, res) {
  const { produtoId, quantidade } = req.body;
  if (!produtoId || !quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: "Mande o produtoId e uma quantidade valida!" });
  }

  const produtoAtualizado = produtoService.darEntrada(produtoId, quantidade);
  if (!produtoAtualizado) return res.status(404).json({ erro: "Produto nao existe!" });

  return res.status(201).json({ msg: "Estoque updated!", produto: produtoAtualizado });
}

export function registrarVenda(req, res) {
  const resultado = produtoService.realizarVenda(req.body.itens);
  if (resultado.erro) return res.status(422).json({ erro: resultado.erro });

  return res.status(201).json({ msg: "Venda aprovada!", novaVenda: resultado.dados });
}

export function obterRelatorio(req, res) {
  return res.json(produtoService.gerarRelatorio());
}
