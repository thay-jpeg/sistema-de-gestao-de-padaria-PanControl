# PanControl+ — Front-end

Sistema de gestão de padaria web. Front-end desenvolvido em **React + Vite + Tailwind CSS**.

---

## ⚡ Pré-requisitos

- Node.js >= 18
- npm >= 9

---

## 🚀 Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Acesse http://localhost:5173
```

---

## 🔑 Usuários de demonstração

| Código | Senha | Perfil    | Acesso                              |
|--------|-------|-----------|-------------------------------------|
| 0001   | 1234  | Gestor    | Tudo (Vendas, Catálogo, Produção, Relatórios, Gerenciamento) |
| 0002   | 1234  | Atendente | Vendas + Catálogo                   |
| 0003   | 1234  | Produtor  | Produção + Catálogo                 |

---

## ⌨️ Atalhos de teclado

### Homepage
| Tecla | Ação             |
|-------|------------------|
| `1`   | Ir para Vendas   |
| `2`   | Ir para Catálogo |
| `3`   | Ir para Produção |
| `4`   | Ir para Relatórios |
| `5`   | Ir para Gerenciamento |

### PDV (Vendas)
| Tecla  | Ação                      |
|--------|---------------------------|
| `P`    | Foco na busca de produtos |
| `/`    | Cancelar venda            |
| `F9`   | Finalizar / Confirmar     |
| `Enter`| Adicionar produto (campo de código) |

### Catálogo
| Tecla  | Ação              |
|--------|-------------------|
| `P`    | Foco na busca     |
| `C`    | Novo produto      |
| `F9`   | Salvar            |
| `F10`  | Excluir           |

### Produção / Gerenciamento
| Tecla  | Ação              |
|--------|-------------------|
| `F9`   | Novo / Salvar     |
| `F10`  | Excluir           |

---

## 📁 Estrutura do projeto

```
src/
├── assets/images/       # Logo PanControl+
├── components/
│   ├── layout/          # Header
│   ├── ui/              # Button, Input, Modal, DataTable, SearchInput
│   └── pdv/             # ProductCard
├── config/
│   └── permissions.js   # Controle de acesso por perfil (ROLES + PERMISSIONS)
├── context/
│   └── AuthContext.jsx  # Contexto global de autenticação
├── hooks/
│   └── useKeyboardShortcut.js
├── mocks/data/          # Dados mockados (users, products, ingredients, clients, productions)
├── pages/
│   ├── Login/           # Tela de login
│   ├── Home/            # Homepage (seletor de módulos)
│   ├── Vendas/          # PDV completo
│   ├── Catalogo/        # Grid + cadastro de produtos
│   ├── Producao/        # Estoque, ingredientes, nova produção
│   ├── Relatorios/      # Filtros e tabela de relatórios
│   └── Gerenciamento/   # Cadastro de clientes e usuários
├── router/
│   └── AppRouter.jsx    # Rotas protegidas por perfil
└── utils/               # (helpers futuros)
```

---

## 🔌 Integração com API

Todos os dados mockados estão em `src/mocks/data/`. Quando o back-end estiver pronto:

1. Crie arquivos em `src/services/` (ex: `productService.js`) com as chamadas `fetch`/`axios`.
2. Substitua as importações de `@/mocks/data/*` pelos serviços correspondentes.
3. O contexto de autenticação (`AuthContext.jsx`) já está preparado para receber um token JWT — basta adaptar a função `login`.

---

## 🎨 Paleta de cores (Tailwind)

| Token          | Hex       | Uso                          |
|----------------|-----------|------------------------------|
| `header`       | `#4D3330` | Barra superior               |
| `brown`        | `#4A3B38` | Cards escuros, tabela header |
| `gold`         | `#D4A054` | Scrollbar, badge de preço    |
| `gold-dark`    | `#9F6619` | Botão Procurar               |
| `green`        | `#307A32` | Vendas, Salvar, Finalizar    |
| `red`          | `#C32325` | Catálogo, Cancelar, Excluir  |
| `cream`        | `#ECE6D6` | Relatórios card              |
| `input-bg`     | `#F2F2F2` | Fundo dos inputs             |
