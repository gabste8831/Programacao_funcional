// categorias que terão promoção
export type CategoriaPromocional = 'fruta' | 'limpeza' | 'padaria';

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria?: CategoriaPromocional;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export interface RegraPromocao {
  id: string;
  descricao: string;
  calcularDesconto: (carrinho: ItemCarrinho[]) => number;
}

export interface ResultadoCalculo {
  subtotal: number;
  descontoTotal: number;
  totalFinal: number;
  detalhesDesconto: Array<{ descricao: string; valor: number }>;
}