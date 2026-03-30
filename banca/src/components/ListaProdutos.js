import React from 'react';
import Produto from './Produto';

const ListaProdutos = ({ produtos, carrinho, onAdicionar, onRemover }) => {
  if (produtos.length === 0) {
    return <div className="container"><p>Nenhum produto encontrado</p></div>;
  }

  return (
    <div className="container" id="produtos">
      {produtos.map(produto => {
        const item = carrinho.find(i => i.nome === produto.nome);
        return (
          <Produto
            key={produto.nome}
            produto={produto}
            quantidade={item ? item.qtd : 0}
            onAdicionar={onAdicionar}
            onRemover={onRemover}
          />
        );
      })}
    </div>
  );
};

export default ListaProdutos;
