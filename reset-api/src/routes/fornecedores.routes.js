import { Router } from 'express';
import * as fornecedorController from '../controllers/fornecedores.controller.js';

const router = Router();

router.get('/', fornecedorController.listar);
router.post('/', fornecedorController.criar);

export default router;