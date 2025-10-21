import React from 'react';
import { Produto } from '../core/types';
import { CATALOGO_PRODUTOS } from '../core/catalogo';
import { formatarMoeda } from '../core/motorDePromocoes';


const AvisoPromocao: React.FC<{ produto: Produto }> = ({ produto }) => {
  let aviso: string | null = null;

  if (produto.id === 'p1') {
    aviso = "PROMO: Leve 3, Pague 2!";
  } else if (produto.categoria === 'limpeza') {
    aviso = "PROMO: Leve 5+ e ganhe % de desconto!";
  }

  if (!aviso) {
    return null;
  }

  return (
    <p style={{
      color: '#007f00', 
      fontWeight: 'bold',
      fontSize: '0.9em',
      margin: '5px 0'
    }}>
      {aviso}
    </p>
  );
};


interface Props {
  onAdicionarProduto: (produto: Produto) => void;
}

const CatalogoProdutos: React.FC<Props> = ({ onAdicionarProduto }) => {
  return (
    <section>
      <h2>Catálogo de Produtos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        
        {CATALOGO_PRODUTOS.map((produto) => (
          <article 
            key={produto.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              borderRadius: '5px',
              width: '200px'
            }}
          >
            <h3>{produto.nome}</h3>
            <p>{formatarMoeda(produto.preco)}</p>
            
            <AvisoPromocao produto={produto} />

            <button onClick={() => onAdicionarProduto(produto)} style={{ width: '100%' }}>
              Adicionar ao Carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CatalogoProdutos;