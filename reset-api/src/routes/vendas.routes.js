import { Router } from 'express';
import * as vendasController from '../controllers/vendas.controller.js';

const router = Router();

function middlewareValidarVenda(req, res, next) {
  const corpo = req.body;
  if (!corpo.itens) {
    return res.status(400).json({ erro: "Mande a lista de itens da venda!" });
  }
  if (corpo.itens.length === 0) {
    return res.status(400).json({ erro: "Sua lista de itens esta vazia!" });
  }
  next();
}

router.post('/', middlewareValidarVenda, vendasController.criarVenda);
router.get('/', vendasController.obterRelatorio);

export default router;