import { fornecedores } from '../data/dados.js';

export function listarTodos() {
  return fornecedores;
}

export function cadastrar(nome, contato) {
  const novoFornecedor = {
    id: fornecedores.length + 1,
    nome: nome,
    contato: contato || ""
  };
  fornecedores.push(novoFornecedor);
  return novoFornecedor;
}