import React from 'react';
import { ItemCarrinho, ResultadoCalculo } from '../core/types';
import { calcularSubtotal, formatarMoeda } from '../core/motorDePromocoes';

interface Props {
  carrinho: ItemCarrinho[];
  onRemoverItem: (produtoId: string) => void;
  onCalcularPromocoes: () => void;
  resultado: ResultadoCalculo | null;
}

const CarrinhoVisual: React.FC<Props> = ({ 
  carrinho, 
  onRemoverItem, 
  onCalcularPromocoes, 
  resultado 
}) => {
  
  const subtotal = calcularSubtotal(carrinho);

  return (
    <section>
      <h2>Carrinho Atual</h2>
      
      {carrinho.length === 0 && (
        <p>O seu carrinho está vazio.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {carrinho.map((item) => (
          <li 
            key={item.produto.id} 
            style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '5px' }}
          >
            <span>{item.produto.nome} (Qtd: {item.quantidade})</span>
            <button onClick={() => onRemoverItem(item.produto.id)} style={{ color: 'red' }}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <h3>Subtotal: {formatarMoeda(subtotal)}</h3>
      
      <hr />
      
      <button 
        onClick={onCalcularPromocoes}
        style={{ width: '100%', padding: '10px', fontSize: '1.2em', cursor: 'pointer' }}
        disabled={carrinho.length === 0} 
      >
        CALCULAR PROMOÇÕES
      </button>

      {resultado && (
        <div style={{ marginTop: '20px', background: '#f4f4f4', padding: '10px' }}>
          <h3>Resultado do Cálculo:</h3>
          
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            Desconto Total: {formatarMoeda(resultado.descontoTotal)}
          </p>
          
          <ul>
            {resultado.detalhesDesconto.map((detalhe) => (
              <li key={detalhe.descricao} style={{ fontSize: '0.9em' }}>
                {detalhe.descricao} ({formatarMoeda(detalhe.valor)})
              </li>
            ))}
          </ul>
          
          <h3 style={{ color: 'green' }}>
            Total Final: {formatarMoeda(resultado.totalFinal)}
          </h3>
        </div>
      )}
    </section>
  );
};

export default CarrinhoVisual;