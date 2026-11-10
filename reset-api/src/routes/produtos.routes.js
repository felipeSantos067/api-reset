import { Router } from 'express';
import * as produtoController from '../controllers/produtos.controller.js';

const router = Router();

function middlewareValidarProduto(req, res, next) {
  const corpo = req.body;
  if (!corpo.nome || !corpo.preco || !corpo.fornecedorId) {
    return res.status(400).json({ erro: "Preencha nome, preco e fornecedorId!" });
  }
  next();
}

function middlewareValidarVenda(req, res, next) {
  const corpo = req.body;
  if (!corpo.itens) return res.status(400).json({ erro: "Mande a lista de itens da venda!" });
  if (corpo.itens.length === 0) return res.status(400).json({ erro: "Sua lista de itens esta vazia!" });
  next();
}

router.get('/', produtoController.listarTodos);
router.get('/', produtoController.listarBaixoEstoque);
router.get('/', produtoController.buscarPorId);
router.post('/', middlewareValidarProduto, produtoController.criar);
router.post('/', produtoController.entradaEstoque);

router.post('/api/vendas', middlewareValidarVenda, produtoController.registrarVenda);
router.get('/api/vendas/relatorio', produtoController.obterRelatorio);

export default router;