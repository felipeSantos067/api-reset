// export const produtos = [
//   { id: 1, nome: "Arroz 5kg", preco: 25.90, estoqueAtual: 20, estoqueMinimo: 5, fornecedorId: 1, categoria: "alimentos" },
//   { id: 2, nome: "Feijão 1kg", preco: 8.50, estoqueAtual: 2, estoqueMinimo: 10, fornecedorId: 1, categoria: "alimentos" },
//   { id: 3, nome: "Detergente", preco: 2.80, estoqueAtual: 15, estoqueMinimo: 8, fornecedorId: 2, categoria: "limpeza" }
// ];


// src/models/tarefas.model.js
// Model: é a única camada que fala com o MongoDB, usando as funções do driver
// (find, insertOne, updateOne, deleteOne...). O service chama estas funções e cuida das regras de negócio.
import { ObjectId } from 'mongodb';
import { obterBanco } from '../config/database.js';

// Atalho para a coleção "tarefas". Cada documento dela é uma tarefa.
function colecao() {
  return obterBanco().collection('produtos');
}

export async function buscarTodas() {
  // mongosh: db.tarefas.find()
  return colecao().find().toArray();
}

export async function buscarPorId(id) {
  // ObjectId.isValid confere o formato antes da consulta. Um id inválido retorna null em vez de gerar erro.
  if (!ObjectId.isValid(id)) {
    return null;
  }
  // mongosh: db.tarefas.findOne({ _id: ObjectId("65f1c2a9e4b0a1b2c3d4e5f6") })
  return colecao().findOne({ _id: new ObjectId(id) });
}

export async function inserir(produtos) {
  // mongosh: db.tarefas.insertOne({ titulo: "Estudar", concluida: false })
  const resultado = await colecao().insertOne(produtos);
  return resultado.insertedId;
}

// O service decide quais campos podem ser alterados. Esta função só repassa esses campos.
export async function atualizar(id, campos) {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  // mongosh: db.tarefas.updateOne({ _id: ObjectId("65f1c2a9e4b0a1b2c3d4e5f6") }, { $set: { concluida: true } })
  const resultado = await colecao().updateOne({ _id: new ObjectId(id) }, { $set: campos });
  return resultado.matchedCount > 0;
}

export async function remover(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  // mongosh: db.tarefas.deleteOne({ _id: ObjectId("65f1c2a9e4b0a1b2c3d4e5f6") })
  const resultado = await colecao().deleteOne({ _id: new ObjectId(id) });
  return resultado.deletedCount > 0;
}