import React from 'react';

const Categorias = ({ categoriaAtual, onCategoriaChange, contarProdutosPorCategoria }) => {
  const categorias = [
    { value: 'todos', label: 'Todos' },
    { value: 'cigarro', label: 'Cigarros' },
    { value: 'bebida', label: 'Bebidas' },
    { value: 'tabacaria', label: 'Tabacaria' },
    { value: 'carta', label: 'Cartas' },
    { value: 'acessorio', label: 'Acessórios' }
  ];

  return (
    <div className="categorias">
      {categorias.map(categoria => (
        <button
          key={categoria.value}
          className={categoriaAtual === categoria.value ? 'ativo' : ''}
          onClick={() => onCategoriaChange(categoria.value)}
        >
          {categoria.label}
          {categoria.value !== 'todos' && contarProdutosPorCategoria && 
            ` (${contarProdutosPorCategoria(categoria.value)})`
          }
        </button>
      ))}
    </div>
  );
};

export default Categorias;
