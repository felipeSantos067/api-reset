import express from 'express';
import fornecedorRoutes from './src/routes/fornecedores.routes.js';
import produtoRoutes from './src/routes/produtos.routes.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("Acessaram a rota: " + req.method + " " + req.url);
  next();
});

app.use(fornecedorRoutes);
app.use(produtoRoutes);

export default app;
