import { ItemCarrinho, ResultadoCalculo } from './types';

//formatação moeda
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

//calculo do subtotal do carrinho
export const calcularSubtotal = (carrinho: ItemCarrinho[]): number => {
  const subtotal = carrinho.reduce((acumulador, item) => {
    const precoDoItem = item.produto.preco * item.quantidade;
    return acumulador + precoDoItem;
  }, 0); 
  return subtotal;
};


// --- Regras de promoção ---

//promo "leve 3 pague 2"
const calcularPromocaoBOGO = (carrinho: ItemCarrinho[]): { descricao: string; valor: number } => {
  const idProdutoAlvo = 'p1'; 
  const precoProduto = 1.50;  
  const quantidadeNecessaria = 3; 
  
  const itemAlvo = carrinho.find(item => item.produto.id === idProdutoAlvo);
  if (!itemAlvo) {
    return { descricao: '', valor: 0 };
  }

  const quantidade = itemAlvo.quantidade;
  const numeroDeDescontos = Math.floor(quantidade / quantidadeNecessaria);
  const valorDesconto = numeroDeDescontos * precoProduto; 

  if (valorDesconto > 0) {
    return {
      descricao: `Promoção Maçã (Leve 3, Pague 2): ${numeroDeDescontos} grátis`,
      valor: valorDesconto
    };
  }
  return { descricao: '', valor: 0 };
};

//regra desconto progressivo por quantidade de itens da mesma categoria
const calcularPromocaoMixMatch = (carrinho: ItemCarrinho[]): { descricao: string; valor: number } => {
  const categoriaAlvo = 'limpeza';
  const quantidadeMinima = 5; 
  const pctDescontoMaximo = 15; 

  const itensDaCategoria = carrinho.filter(
    item => item.produto.categoria === categoriaAlvo
  );

  const totalDeItens = itensDaCategoria.reduce(
    (acc, item) => acc + item.quantidade, 
    0
  );

  if (totalDeItens >= quantidadeMinima) {
    
    const subtotalItens = itensDaCategoria.reduce(
      (acc, item) => acc + (item.produto.preco * item.quantidade),
      0
    );

    const pctDesconto = Math.min(totalDeItens, pctDescontoMaximo);
    
    const valorDesconto = subtotalItens * (pctDesconto / 100);

    if (valorDesconto > 0) {
      return {
        descricao: `Promo Limpeza (${totalDeItens} itens): ${pctDesconto}% OFF`,
        valor: valorDesconto
      };
    }
  }
  
  return { descricao: '', valor: 0 };
};

//compilação do resultado final das promoções
export const calcularPromocoes = (carrinho: ItemCarrinho[]): ResultadoCalculo => {
  const subtotal = calcularSubtotal(carrinho);
  
  const regrasDePromocao = [
    calcularPromocaoBOGO,
    calcularPromocaoMixMatch
  ];

  const detalhesDesconto = regrasDePromocao
    .map(funcaoDaRegra => funcaoDaRegra(carrinho))
    .filter(resultado => resultado.valor > 0);

  const descontoTotal = detalhesDesconto.reduce(
    (acc, desconto) => acc + desconto.valor,
    0
  );

  const totalFinal = subtotal - descontoTotal;
  
  return {
    subtotal,
    descontoTotal,
    totalFinal,
    detalhesDesconto
  };
};