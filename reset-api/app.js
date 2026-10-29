import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());


const produtos = [
  { id: 1, nome: "Arroz 5kg", preco: 25.90, estoqueAtual: 20, estoqueMinimo: 5, fornecedorId: 1, categoria: "alimentos" },
  { id: 2, nome: "Feijão 1kg", preco: 8.50, estoqueAtual: 2, estoqueMinimo: 10, fornecedorId: 1, categoria: "alimentos" },
  { id: 3, nome: "Detergente", preco: 2.80, estoqueAtual: 15, estoqueMinimo: 8, fornecedorId: 2, categoria: "limpeza" }
];

const fornecedores = [
  { id: 1, nome: "Distribuidora Alimentos S.A.", contato: "vendas@distribuidora.com" }
];

const movimentacoes = [];
const vendas = [];


function middlewareLog(req, res, next) {
  console.log("Acessaram a rota: " + req.method + " " + req.url);
  next();
}
app.use(middlewareLog);


function middlewareValidarProduto(req, res, next) {
  const corpo = req.body;
  if (!corpo.nome || !corpo.preco || !corpo.fornecedorId) {
    return res.status(400).json({ erro: "Preencha nome, preco e fornecedorId!" });
  }
  next();
}


function middlewareValidarVenda(req, res, next) {
  const corpo = req.body;
  if (!corpo.itens) {
    return res.status(400).json({ erro: "Mande a lista de itens da venda!" });
  }
  if (corpo.itens.length === 0) {
    return res.status(400).json({ erro: "Sua lista de itens esta vazia!" });
  }
  next();
}


app.post('/api/fornecedores', (req, res) => {
  const corpo = req.body;
  if (!corpo.nome) {
    return res.status(400).json({ erro: "Nome e obrigatorio!" });
  }

  const novoFornecedor = {
    id: fornecedores.length + 1,
    nome: corpo.nome,
    contato: corpo.contato || ""
  };

  fornecedores.push(novoFornecedor);
  return res.status(201).json(novoFornecedor);
});


app.get('/api/fornecedores', (req, res) => {
  return res.json(fornecedores);
});


app.post('/api/produtos', middlewareValidarProduto, (req, res) => {
  const corpo = req.body;

  const novoProduto = {
    id: produtos.length + 1,
    nome: corpo.nome,
    preco: Number(corpo.preco),
    estoqueAtual: 0,
    estoqueMinimo: corpo.estoqueMinimo ? Number(corpo.estoqueMinimo) : 5,
    fornecedorId: Number(corpo.fornecedorId),
    categoria: corpo.categoria ? corpo.categoria.toLowerCase() : "geral"
  };

  produtos.push(novoProduto);
  return res.status(201).json(novoProduto);
});


app.get('/api/produtos', (req, res) => {
  const filtro = req.query.categoria;

  if (filtro) {
    const filtrados = [];
    for (let i = 0; i < produtos.length; i++) {
      if (produtos[i].categoria === filtro.toLowerCase()) {
        filtrados.push(produtos[i]);
      }
    }
    return res.json(filtrados);
  }

  return res.json(produtos);
});


app.get('/api/produtos/:id', (req, res) => {
  const idProcurado = parseInt(req.params.id);
  let encontrado = null;

  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === idProcurado) {
      encontrado = produtos[i];
    }
  }

  if (!encontrado) {
    return res.status(404).json({ erro: "Produto nao encontrado!" });
  }

  return res.json(encontrado);
});


app.get('/api/produtos/estoque/baixo', (req, res) => {
  const estoqueBaixo = [];
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].estoqueAtual < produtos[i].estoqueMinimo) {
      estoqueBaixo.push(produtos[i]);
    }
  }
  return res.json(estoqueBaixo);
});





app.post('/api/produtos/entrada', (req, res) => {
  const corpo = req.body;
  if (!corpo.produtoId || !corpo.quantidade || corpo.quantidade <= 0) {
    return res.status(400).json({ erro: "Mande o produtoId e uma quantidade valida!" });
  }

  let produto = null;
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === parseInt(corpo.produtoId)) {
      produto = produtos[i];
    }
  }

  if (!produto) {
    return res.status(404).json({ erro: "Produto nao existe!" });
  }

  produto.estoqueAtual += parseInt(corpo.quantidade);

  movimentacoes.push({
    id: movimentacoes.length + 1,
    produtoId: produto.id,
    tipo: "ENTRADA",
    quantidade: parseInt(corpo.quantidade)
  });

  return res.status(201).json({ msg: "Estoque atualizado!", produto });
});


app.post('/api/vendas', middlewareValidarVenda, (req, res) => {
  const listaVenda = req.body.itens;
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
      return res.status(422).json({ erro: "O produto ID " + item.produtoId + " nao existe!" });
    }


    if (produto.estoqueAtual < item.quantidade) {
      return res.status(422).json({ erro: "Estoque insuficiente para: " + produto.nome });
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

  return res.status(201).json({ msg: "Venda aprovada!", novaVenda });
});


app.get('/api/vendas/relatorio', (req, res) => {
  const quantidadeVendas = vendas.length;
  let faturamento = 0;

  for (let i = 0; i < vendas.length; i++) {
    faturamento += vendas[i].valorTotal;
  }

  let ticketMedio = 0;
  if (quantidadeVendas > 0) {
    ticketMedio = faturamento / quantidadeVendas;
  }

  return res.json({
    totalFaturado: faturamento,
    quantidadeVendas: quantidadeVendas,
    ticketMedio: ticketMedio
  });
});

// app.use('/*', (req, res) => {
//   return res.status(404).json({ erro: "Essa rota nao existe!" });
// });

app.listen(PORT, () => {
  console.log(" Servidor ligado na porta " + PORT);
});





