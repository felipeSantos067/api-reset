import { Router } from 'express';
import * as fornecedorController from '../controllers/fornecedores.controller.js';

const router = Router();

router.get('/api/fornecedores', fornecedorController.listar);
router.post('/api/fornecedores', fornecedorController.criar);

export default router;