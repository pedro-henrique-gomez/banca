import React from 'react';
import { handleImageError } from '../utils/imageUtils';

const Produto = ({ produto, quantidade, onAdicionar, onRemover }) => {
  return (
    <div className="produto">
      <div className="produto-img">
        <img 
          src={produto.img} 
          alt={produto.nome} 
          onError={handleImageError}
        />
      </div>
      <h3>{produto.nome}</h3>
      <p>R$ {produto.preco.toFixed(2)}</p>

      <div className="controle-card">
        <button onClick={() => onRemover(produto.nome)}>-</button>
        <span>{quantidade}</span>
        <button onClick={() => onAdicionar(produto.nome, produto.preco)}>+</button>
      </div>
    </div>
  );
};

export default Produto;
