import { produtos } from '../models/produtos.model.js';
import { movimentacoes } from '../models/movimentacoes.model.js';

export function darEntrada(produtoId, quantidade) {
  let produto = null;
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === parseInt(produtoId)) {
      produto = produtos[i];
    }
  }

  if (!produto) {
    return null;
  }

  produto.estoqueAtual += parseInt(quantidade);

  const novaMovimentacao = {
    id: movimentacoes.length + 1,
    produtoId: produto.id,
    tipo: "ENTRADA",
    quantidade: parseInt(quantidade)
  };

  movimentacoes.push(novaMovimentacao);
  return produto;
}
