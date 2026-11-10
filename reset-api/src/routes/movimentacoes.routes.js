import { Router } from 'express';
import * as movimentacoesController from '../controllers/movimentacoes.controller.js';

const router = Router();

router.post('/api/produtos/entrada', movimentacoesController.entradaEstoque);

export default router;
