# Trabalho Programação Funcional - Tema: Promoções de Varejo

Este projeto foi desenvolvido para a disciplina de **Linguagem de Programação e Paradigmas** e tem como objetivo aplicar os conceitos fundamentais do paradigma de programação funcional em uma aplicação prática.

O sistema simula o carrinho de compras de um varejo (Tema 24), permitindo ao usuário adicionar produtos e calcular descontos com base em um conjunto de regras de negócio, como "Compre X, Leve Y" e descontos progressivos por categoria.

## Alunos

| Desenvolvedor      | GitHub                                     |
| :----------------- | :----------------------------------------- |
| Gabriel Steffens   | [@gabste8831](https://github.com/gabste8831) |
| Lucas Weigel       | [@Lucas1063](https://github.com/Lucas1063)  |

## Tecnologias Utilizadas

* **React (Vite):** Utilizado para a construção da interface de usuário.
* **TypeScript:** Utilizado para garantir a tipagem dos dados e a forma das funções.

---

## Como Instalar e Executar

**Pré-requisitos:**
* Node.js (v16 ou superior)
* NPM ou Yarn

**Instalação:**
1.  Clone o repositório:
    ```bash
    git clone [https://github.com/gabste8831/Programacao_funcional.git]
    ```

2.  Navegue até a pasta do projeto:
    ```bash
    cd Programacao_funcional
    ```

3.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

5.  Abra o link localHost que o terminal indicar.

---

## Como os Conceitos de Programação Funcional Foram Aplicados

O requisito central do trabalho é aplicar os conceitos de **Funções Puras**, **Imutabilidade** e **Funções de Ordem Superior (`map`, `filter`, `reduce`)**.

Para atender a isso, o projeto foi estruturalmente dividido em dois "estagios":

1.  **O "Estágio Impuro" (`src/App.tsx`, `src/components/`)**: Componentes React que, por natureza, gerenciam estado e causam efeitos colaterais (redesenhar a tela).
2.  **O "Estágio Puro" (`src/core/`)**: Uma biblioteca de lógica de negócio 100% funcional, sem estado e sem efeitos colaterais, que apenas recebe dados e retorna dados.

### 1. Funções Puras

Toda a lógica de negócio do sistema reside no arquivo `src/core/motorDePromocoes.ts`. Este arquivo exporta apenas funções puras, que:
* Não possuem efeitos colaterais (não alteram variáveis globais, não fazem `console.log`).
* Para a mesma entrada, sempre retornam a mesma saída.

Principais funções:
* `calcularSubtotal(carrinho)`: Recebe um carrinho e retorna um número.
* `calcularPromocaoBOGO(carrinho)`: Recebe um carrinho e retorna um objeto de desconto.
* `calcularPromocaoMixMatch(carrinho)`: Recebe um carrinho e retorna um objeto de desconto.
* `calcularPromocoes(carrinho)`: A função principal, que orquestra as outras funções puras e retorna o `ResultadoCalculo` final.

### 2. Imutabilidade

O princípio da imutabilidade foi respeitado em ambos os estágios:

**No "Estágio Puro" (`src/core`):**
O `carrinho` é recebido como argumento em todas as funções de cálculo e nunca é modificado. Funções de ordem superior (`filter`, `reduce`) são usadas para ler os dados e criar novos valores agregados (como `totalDeItens` ou `subtotalItens`), sem alterar o array original.

**No "Estágio Impuro" (`src/App.tsx`):**
Mesmo no React, onde o estado precisa ser alterado, a imutabilidade foi mantida. Em vez de modificar o `carrinho` diretamente (ex: `carrinho.push(item)`), usamos técnicas funcionais para criar um novo array de carrinho a cada atualização:

* **Para Adicionar (`handleAdicionarProduto`):**
    ```typescript
    // Adiciona um novo item (imutável com spread operator)
    const novoCarrinho = [...carrinho, { produto: produto, quantidade: 1 }];
    setCarrinho(novoCarrinho);
    ```
* **Para Remover (`handleRemoverItem`):**
    ```typescript
    // .filter cria um novo array imutável
    const novoCarrinho = carrinho.filter(item => item.produto.id !== produtoId);
    setCarrinho(novoCarrinho);
    ```

### 3. Funções de Ordem Superior (Map, Filter, Reduce)

O uso de `map`, `filter` e `reduce` é evidente em todo o projeto, como exigido, e diante conceitos chaves da programação funcional:

* **`filter`:**
    * Usado em `calcularPromocaoMixMatch` para criar um novo array contendo apenas os itens da categoria "limpeza".
    * Usado em `handleRemoverItem` (React) para criar um novo carrinho sem o item removido.

* **`reduce`:**
    * Usado em `calcularSubtotal` para "reduzir" o array `carrinho` a um único valor numérico (o subtotal).
    * Usado em `calcularPromocaoMixMatch` duas vezes: primeiro para somar a *quantidade* total de itens de limpeza, e depois para somar o *subtotal* desses itens.
    * Usado em `calcularPromocoes` para somar o valor de todos os descontos retornados pela pipeline de regras.

* **`map`:**
    * Usado em `calcularPromocoes` de forma declarativa: transformamos um array de funções (`regrasDePromocao`) em um array de resultados (`detalhesDesconto`), aplicando cada regra ao carrinho.
    * Usado em `handleAdicionarProduto` (React) para criar um novo carrinho ao atualizar a quantidade de um item existente.

---

## Exemplos de Entrada e Saída

A aplicação permite testar a lógica de forma interativa.

### Cenário 1: Teste da Promoção BOGO (Maçã)

* **Entrada:**
    * Adicionar `3 x Maçã (Unidade)` (R$ 1,50 cada)
* **Cálculo (Saída Esperada):**
    * Subtotal: R$ 4,50
    * Detalhes do Desconto: `Promoção Maçã (Leve 3, Pague 2): 1 grátis (R$ 1,50)`
    * Desconto Total: R$ 1,50
    * **Total Final: R$ 3,00**

### Cenário 2: Teste da Promoção Progressiva (Limpeza)

* **Entrada:**
    * Adicionar `6 x Detergente` (R$ 5,00 cada)
* **Cálculo (Saída Esperada):**
    * Subtotal: R$ 30,00
    * Detalhes do Desconto: `Promo Limpeza (6 itens): 6% OFF (R$ 1,80)`
    * Desconto Total: R$ 1,80
    * **Total Final: R$ 28,20**

### Cenário 3: Teste do Limite da Promoção (Limpeza)

* **Entrada:**
    * Adicionar `20 x Detergente` (R$ 5,00 cada)
* **Cálculo (Saída Esperada):** (A regra atinge o teto de 15%)
    * Subtotal: R$ 100,00
    * Detalhes do Desconto: `Promo Limpeza (20 itens): 15% OFF (R$ 15,00)`
    * Desconto Total: R$ 15,00
    * **Total Final: R$ 85,00**

### Cenário 4: Teste de Promoções Combinadas

* **Entrada:**
    * Adicionar `3 x Maçã (Unidade)` (R$ 4,50)
    * Adicionar `6 x Detergente` (R$ 30,00)
* **Cálculo (Saída Esperada):**
    * Subtotal: R$ 34,50
    * Detalhes do Desconto:
        * `Promoção Maçã (Leve 3, Pague 2): 1 grátis (R$ 1,50)`
        * `Promo Limpeza (6 itens): 6% OFF (R$ 1,80)`
    * Desconto Total: R$ 3,30
    * **Total Final: R$ 31,20**

 ---

## Imagem da aplicação:
<img width="1920" height="1018" alt="screencapture-localhost-5173-2025-10-21-20_54_07" src="https://github.com/user-attachments/assets/9ec9751f-1a16-4d92-ac36-1ce108c30f48" />
