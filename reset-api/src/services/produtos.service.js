import { produtos, movimentacoes, vendas } from '../data/dados.js';

export function listar(categoria) {
  const filtro = categoria;

  if (filtro) {
    const filtrados = [];
    for (let i = 0; i < produtos.length; i++) {
      if (produtos[i].categoria === filtro) {
        filtrados.push(produtos[i]);
      }
    }
    return filtrados;
  }

  return produtos;
}

export function listarEstoqueBaixo() {
  const estoqueBaixo = [];
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].estoqueAtual < produtos[i].estoqueMinimo) {
      estoqueBaixo.push(produtos[i]);
    }
  }
  return estoqueBaixo;
}

export function buscarPorId(id) {
  const idProcurado = id;
  let encontrado = null;

  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === idProcurado) {
      encontrado = produtos[i];
    }
  }

  return encontrado;
}

export function cadastrar(corpo) {
  const novoProduto = {
    id: produtos.length + 1,
    nome: corpo.nome,
    preco: Number(corpo.preco),
    estoqueAtual: 0,
    estoqueMinimo: corpo.estoqueMinimo ? Number(corpo.estoqueMinimo) : 5,
    fornecedorId: Number(corpo.fornecedorId),
    categoria: corpo.categoria ? corpo.categoria : "geral"
  };

  produtos.push(novoProduto);
  return novoProduto;
}

export function darEntrada(produtoId, quantidade) {
  const corpo = { produtoId, quantidade };

  let produto = null;
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === parseInt(corpo.produtoId)) {
      produto = produtos[i];
    }
  }

  if (!produto) {
    return null;
  }

  produto.estoqueAtual += parseInt(corpo.quantidade);

  movimentacoes.push({
    id: movimentacoes.length + 1,
    produtoId: produto.id,
    tipo: "ENTRADA",
    quantidade: parseInt(corpo.quantidade)
  });

  return produto;
}

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