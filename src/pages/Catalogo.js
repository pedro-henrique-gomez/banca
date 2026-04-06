import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Categorias from '../components/Categorias';
import ListaProdutos from '../components/ListaProdutos';
import ListaProdutosCategorizada from '../components/ListaProdutosCategorizada';
import Carrinho from '../components/Carrinho';
import { useProdutos } from '../hooks/useProdutos';
import './Catalogo.css';

const Catalogo = ({ 
  carrinho, 
  buscaAtual, 
  categoriaAtual, 
  cartOpen, 
  nome, 
  endereco, 
  pagamento, 
  onBuscaChange, 
  onCategoriaChange, 
  onCartToggle, 
  add, 
  menosCard, 
  mais, 
  menos, 
  total, 
  qtdTotal, 
  onNomeChange, 
  onEnderecoChange, 
  onPagamentoChange, 
  enviar 
}) => {
  // Hook para gerenciar produtos do banco de dados
  const { produtos: todosProdutos, carregando, erro, carregarProdutos } = useProdutos();

  // Filtrar produtos baseado na busca e categoria
  const produtosFiltrados = todosProdutos.filter(p =>
    (categoriaAtual === "todos" || p.categoria === categoriaAtual) &&
    p.nome.toLowerCase().includes(buscaAtual.toLowerCase())
  );

  // Contador de produtos por categoria
  const contarProdutosPorCategoria = (categoria) => {
    return todosProdutos.filter(p => p.categoria === categoria).length;
  };

  // Mostrar mensagem de carregamento
  if (carregando && todosProdutos.length === 0) {
    return (
      <div className="catalogo-wrapper">
        {/* Sidebar só aparece na área admin */}
        <div className="main-content">
          <div className="header-section">
            <div className="header-top">
              <Header 
                busca={buscaAtual}
                onBuscaChange={onBuscaChange}
                contador={qtdTotal}
                onCartToggle={onCartToggle}
              />
            </div>
            <Categorias 
              categoriaAtual={categoriaAtual}
              onCategoriaChange={onCategoriaChange}
            />
          </div>
          <div className="products-section">
            <div className="loading-message">
              <p>Carregando produtos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar mensagem de erro
  if (erro) {
    return (
      <div className="catalogo-wrapper">
        {/* Sidebar só aparece na área admin */}
        <div className="main-content">
          <div className="header-section">
            <div className="header-top">
              <Header 
                busca={buscaAtual}
                onBuscaChange={onBuscaChange}
                contador={qtdTotal}
                onCartToggle={onCartToggle}
              />
            </div>
            <Categorias 
              categoriaAtual={categoriaAtual}
              onCategoriaChange={onCategoriaChange}
            />
          </div>
          <div className="products-section">
            <div className="error-message">
              <p>Erro ao carregar produtos: {erro}</p>
              <button onClick={carregarProdutos} className="btn-retry">
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-wrapper">
      {/* Sidebar só aparece na área admin */}
      <div className="main-content">
        <div className="header-section">
          <div className="header-top">
            <Header 
              busca={buscaAtual}
              onBuscaChange={onBuscaChange}
              contador={qtdTotal}
              onCartToggle={onCartToggle}
            />
          </div>

          <Categorias 
            categoriaAtual={categoriaAtual}
            onCategoriaChange={onCategoriaChange}
            contarProdutosPorCategoria={contarProdutosPorCategoria}
          />
        </div>

        <div className="products-section">
          {produtosFiltrados.length === 0 ? (
            <div className="no-products-message">
              <p>Nenhum produto encontrado para os filtros selecionados.</p>
              {buscaAtual && (
                <button onClick={() => onBuscaChange('')} className="btn-clear-search">
                  Limpar busca
                </button>
              )}
            </div>
          ) : categoriaAtual === 'todos' ? (
            <ListaProdutosCategorizada 
              produtos={produtosFiltrados}
              carrinho={carrinho}
              onAdicionar={add}
              onRemover={menosCard}
            />
          ) : (
            <ListaProdutos 
              produtos={produtosFiltrados}
              carrinho={carrinho}
              onAdicionar={add}
              onRemover={menosCard}
            />
          )}
        </div>

        <Carrinho
          isOpen={cartOpen}
          carrinho={carrinho}
          total={total}
          onClose={onCartToggle}
          onMais={mais}
          onMenos={menos}
          onEnviar={enviar}
          nome={nome}
          endereco={endereco}
          pagamento={pagamento}
          onNomeChange={onNomeChange}
          onEnderecoChange={onEnderecoChange}
          onPagamentoChange={onPagamentoChange}
        />
      </div>
    </div>
  );
};

export default Catalogo;
