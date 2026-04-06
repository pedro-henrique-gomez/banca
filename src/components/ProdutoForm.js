import React, { useState, useEffect } from 'react';
import './ProdutoForm.css';

const ProdutoForm = ({ produto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoria: 'cigarro',
    img: ''
  });

  const [errors, setErrors] = useState({});

  const categorias = [
    { value: 'cigarro', label: 'Cigarros' },
    { value: 'bebida', label: 'Bebidas' },
    { value: 'tabacaria', label: 'Tabacaria' },
    { value: 'carta', label: 'Cartas' },
    { value: 'acessorio', label: 'Acessórios' }
  ];

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        preco: produto.preco || '',
        categoria: produto.categoria || 'cigarro',
        img: produto.img || ''
      });
    }
  }, [produto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que 0';
    }
    
    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const produtoData = {
      ...formData,
      nome: formData.nome.trim(),
      preco: parseFloat(formData.preco),
      img: formData.img.trim() || '/images/generic-product.svg'
    };

    onSave(produtoData);
  };

  return (
    <form className="produto-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nome">Nome do Produto *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Ex: Coca-Cola Lata"
          className={errors.nome ? 'error' : ''}
        />
        {errors.nome && <span className="error-message">{errors.nome}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="preco">Preço (R$) *</label>
        <input
          type="number"
          id="preco"
          name="preco"
          value={formData.preco}
          onChange={handleChange}
          placeholder="Ex: 8.50"
          step="0.01"
          min="0"
          className={errors.preco ? 'error' : ''}
        />
        {errors.preco && <span className="error-message">{errors.preco}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoria *</label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className={errors.categoria ? 'error' : ''}
        >
          {categorias.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.categoria && <span className="error-message">{errors.categoria}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="img">URL da Imagem (opcional)</label>
        <input
          type="text"
          id="img"
          name="img"
          value={formData.img}
          onChange={handleChange}
          placeholder="Deixe em branco para usar imagem genérica"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancelar
        </button>
        <button type="submit" className="btn-save">
          {produto ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </button>
      </div>
    </form>
  );
};

export default ProdutoForm;
