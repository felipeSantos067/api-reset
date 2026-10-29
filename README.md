# Controle de Estoque e Vendas - API Comercial

 API desenvolvida para gerenciamento de estoque, movimentações de produtos e fluxo de vendas.

**Autor:** Felipe Eduardo A. Santos (Trabalho Individual)  
**Framework:** Express.js v5.3.0 (Banco em Memória)

## 📌 Comandos de Execução
No terminal do seu Codespaces, execute:
```bash
npm install
npm start
```

## 🗺️ Guia de Rotas da API (Prefixo `/api`)

### Fornecedores
* `POST /api/fornecedores` - Cria parceiro comercial. Body: `{ "nome": "Firma X", "contato": "vendas@x.com" }`
* `GET /api/fornecedores` - Traz listagem de fornecedores.

### Produtos
* `POST /api/produtos` - Cadastra item. Body: `{ "nome": "Arroz", "preco": 25.0, "estoqueMinimo": 5, "fornecedorId": 1, "categoria": "alimentos" }`
* `GET /api/produtos` - Busca todos os produtos (Aceita query string `/api/produtos?categoria=alimentos`).
* `GET /api/produtos/:id` - Busca por ID usando parâmetros de rota.
* `GET /api/produtos/estoque/baixo` - Traz alertas de itens com estoque abaixo do mínimo.

### Vendas e Movimentação
* `POST /api/produtos/entrada` - Registra a entrada física e reabastecimento de produtos no estoque.
* `POST /api/vendas` - Registra venda multi-itens (Com trava automática se faltar estoque e middleware de validação).
* `GET /api/vendas/relatorio` - Exibe faturamento acumulado, número de vendas e o ticket médio.