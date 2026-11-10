import { produtos } from '../models/produtos.model.js';
import { vendas } from '../models/vendas.model.js';

export function realizarVenda(itensVenda) {
  const listaVenda = itensVenda;
  const copiaEstoqueAntesdaVenda = [];
  const itensVendidos = [];
  let totalDinheiro = 0;

  for (let i = 0; i < listaVenda.length; i++) {
    const item = listaVenda[i];
    let produto = null;

    for (let j = 0; j < produtos.length; j++) {
      if (produtos[j].id === parseInt(item.produtoId)) {
        produto = produtos[j];
      }
    }

    if (!produto) {
      return { erro: "O produto ID " + item.produtoId + " nao existe!" };
    }

    if (produto.estoqueAtual < item.quantidade) {
      return { erro: "Estoque insuficiente para: " + produto.nome };
    }

    copiaEstoqueAntesdaVenda.push({ produtoId: produto.id, estoqueVelho: produto.estoqueAtual });

    produto.estoqueAtual -= item.quantidade;
    totalDinheiro += produto.preco * item.quantidade;

    itensVendidos.push({ produtoId: produto.id, nome: produto.nome, quantidade: item.quantidade, preco: produto.preco });
  }

  const novaVenda = {
    id: vendas.length + 1,
    data: new Date(),
    valorTotal: totalDinheiro,
    itens: itensVendidos
  };
  vendas.push(novaVenda);

  return { dados: novaVenda };
}

export function gerarRelatorio() {
  const quantidadeVendas = vendas.length;
  let faturamento = 0;

  for (let i = 0; i < vendas.length; i++) {
    faturamento += vendas[i].valorTotal;
  }

  let ticketMedio = 0;
  if (quantidadeVendas > 0) {
    ticketMedio = faturamento / quantidadeVendas;
  }

  return {
    totalFaturado: faturamento,
    quantidadeVendas: quantidadeVendas,
    ticketMedio: ticketMedio
  };
}
