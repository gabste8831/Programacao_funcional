import React, { useState } from 'react';
import { ItemCarrinho, Produto, ResultadoCalculo } from './core/types';
import CatalogoProdutos from './components/CatalogoProdutos';
import CarrinhoVisual from './components/CarrinhoVisual';
import { calcularPromocoes } from './core/motorDePromocoes';

 //* raiz da aplicação.
function App() {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);

  //* adiciona produto no carrinho
  const handleAdicionarProduto = (produto: Produto) => {
    // reseta o calculo, forçando refazer
    setResultado(null); 
    
    const itemExistente = carrinho.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      // atualiza a quantidade de um item existente (.map)
      const novoCarrinho = carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item 
      );
      setCarrinho(novoCarrinho);
    } else {
      // add item com spread operation
      const novoCarrinho = [...carrinho, { produto: produto, quantidade: 1 }];
      setCarrinho(novoCarrinho);
    }
  };

  //* remoção de item
  const handleRemoverItem = (produtoId: string) => {
    setResultado(null); 
    
    const novoCarrinho = carrinho.filter(item => item.produto.id !== produtoId);
    setCarrinho(novoCarrinho);
  };
  
  //* calculo das promoções
  const handleCalcularPromocoes = () => {
    const resultadoCalculado = calcularPromocoes(carrinho);    
    setResultado(resultadoCalculado);
  };

  return (
    <div className="App" style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h1>Calculadora de Promoções de Varejo</h1>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
        <CatalogoProdutos onAdicionarProduto={handleAdicionarProduto} />
        
        {/* CarrinhoVisual recebe o estado atual */}
        <CarrinhoVisual 
          carrinho={carrinho} 
          onRemoverItem={handleRemoverItem}
          onCalcularPromocoes={handleCalcularPromocoes}
          resultado={resultado}
        />
      </main>

      <footer>
        <p>Desenvolvido por: Gabriel Steffens & Lucas Weigel</p>
      </footer>
    </div>
  );
}

export default App;