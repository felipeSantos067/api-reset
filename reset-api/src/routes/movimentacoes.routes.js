import { Router } from 'express';
import * as movimentacoesController from '../controllers/movimentacoes.controller.js';

const router = Router();

router.post('/', movimentacoesController.entradaEstoque);

export default router;
