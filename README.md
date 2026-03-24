# SpendFy — Frontend

Interface web do SpendFy, sistema de gestão financeira pessoal desenvolvido como projeto acadêmico na UFAPE.

## Integrantes
- Felipe Mendes
- Guilherme Felix
- Lucas Tchaikovsky
- Pedro Medeiros

## Sobre o Projeto

O SpendFy Frontend oferece uma interface para controle financeiro pessoal, com as seguintes funcionalidades:

- **Dashboard** — resumo do saldo total, receitas, despesas e últimas movimentações
- **Transações** — listagem, cadastro, edição e exclusão de transações; exportação em CSV e PDF
- **Contas** — gerenciamento de contas bancárias com saldo inicial e saldo atual calculado
- **Categorias** — cadastro de categorias para classificar transações
- **Orçamentos** — definição de limites de gasto por categoria e período, com acompanhamento do valor gasto e restante

## Tecnologias

- React 19 + Vite
- Tailwind CSS 4
- Axios
- React Router DOM 7
- Lucide React (ícones)

## Pré-requisitos

- Node.js 18+
- Backend do SpendFy rodando na porta 8080 (veja [spend-fy-api](../spend-fy-api))

## Como executar

```bash
# Instalar dependências
cd spendfy-front
npm install

# Iniciar em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em: http://localhost:5173

## Variáveis de ambiente

Por padrão a URL da API aponta para `http://localhost:8080/api`. Para alterar, edite o arquivo `src/api/axios.js` ou configure a variável de ambiente:

```bash
VITE_API_URL=http://seu-servidor:8080/api
```
