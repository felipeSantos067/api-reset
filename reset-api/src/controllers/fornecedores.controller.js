import * as fornecedorService from '../services/fornecedores.service.js';

export function listar(req, res) {
  const lista = fornecedorService.listarTodos();
  return res.json(lista);
}

export function criar(req, res) {
  const corpo = req.body;
  
  if (!corpo.nome) {
    return res.status(400).json({ erro: "Nome e obrigatorio!" });
  }

  const novo = fornecedorService.cadastrar(corpo.nome, corpo.contato);
  return res.status(201).json(novo);
}