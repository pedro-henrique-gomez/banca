import React from 'react';
import Produto from './Produto';
import './ListaProdutosCategorizada.css';

const ListaProdutosCategorizada = ({ produtos, carrinho, onAdicionar, onRemover }) => {
  // Agrupar produtos por categoria
  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    if (!acc[produto.categoria]) {
      acc[produto.categoria] = [];
    }
    acc[produto.categoria].push(produto);
    return acc;
  }, {});

  // Nomes amigáveis das categorias
  const nomesCategorias = {
    'cigarro': 'Cigarros',
    'bebida': 'Bebidas',
    'tabacaria': 'Tabacaria',
    'carta': 'Cartas',
    'acessorio': 'Acessórios'
  };

  // Ordem das categorias
  const ordemCategorias = ['cigarro', 'bebida', 'tabacaria', 'carta', 'acessorio'];

  return (
    <div className="catalogo-categorizado">
      {ordemCategorias.map((categoria) => {
        const produtosDaCategoria = produtosPorCategoria[categoria];
        
        if (!produtosDaCategoria || produtosDaCategoria.length === 0) {
          return null;
        }

        return (
          <div key={categoria} className="secao-categoria">
            <h2 className="titulo-categoria">
              {nomesCategorias[categoria]} ({produtosDaCategoria.length})
            </h2>
            <div className="container">
              {produtosDaCategoria.map(produto => {
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
          </div>
        );
      })}
    </div>
  );
};

export default ListaProdutosCategorizada;
