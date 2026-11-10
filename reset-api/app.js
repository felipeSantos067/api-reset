import express from 'express';
import fornecedorRoutes from './src/routes/fornecedores.routes.js';
import produtoRoutes from './src/routes/produtos.routes.js';
import movimentacaoRoutes from './src/routes/movimentacoes.routes.js';
import vendaRoutes from './src/routes/vendas.routes.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("Acessaram a rota: " + req.method + " " + req.url);
  next();
});

app.use('/fornecedores', fornecedorRoutes);
app.use('/produtos', produtoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
app.use('/vendas', vendaRoutes);

export default app;