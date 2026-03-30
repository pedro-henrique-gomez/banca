import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProdutoService from '../services/produtoService';
import './CadastroProduto.css';

const CadastroProduto = () => {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoria: 'cigarro',
    img: ''
  });

  const [mensagem, setMensagem] = useState('');
  const [produtosCadastrados, setProdutosCadastrados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const categorias = [
    { value: 'cigarro', label: 'Cigarros' },
    { value: 'bebida', label: 'Bebidas' },
    { value: 'tabacaria', label: 'Tabacaria' },
    { value: 'carta', label: 'Cartas' },
    { value: 'acessorio', label: 'Acessórios' }
  ];

  // Carregar produtos cadastrados ao montar o componente
  useEffect(() => {
    carregarProdutosCadastrados();
  }, []);

  const carregarProdutosCadastrados = async () => {
    try {
      const resultado = await ProdutoService.listarProdutos();
      if (resultado.success) {
        setProdutosCadastrados(resultado.data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.preco || !formData.categoria) {
      setMensagem('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    setCarregando(true);

    try {
      // Preparar dados do produto
      const produtoData = {
        nome: formData.nome.trim(),
        preco: parseFloat(formData.preco),
        categoria: formData.categoria,
        img: formData.img.trim() || '/images/generic-product.svg'
      };

      // Salvar no banco de dados
      const resultado = await ProdutoService.adicionarProduto(produtoData);

      if (resultado.success) {
        setMensagem('Produto cadastrado com sucesso!');
        setFormData({
          nome: '',
          preco: '',
          categoria: 'cigarro',
          img: ''
        });

        // Recarregar lista de produtos
        await carregarProdutosCadastrados();
      } else {
        setMensagem(`Erro ao cadastrar produto: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setMensagem('Ocorreu um erro ao cadastrar o produto. Tente novamente.');
    } finally {
      setCarregando(false);
    }

    // Limpar mensagem após 5 segundos
    setTimeout(() => setMensagem(''), 5000);
  };

  const handleExcluirProduto = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      const resultado = await ProdutoService.excluirProduto(id);
      if (resultado.success) {
        setMensagem('Produto excluído com sucesso!');
        await carregarProdutosCadastrados();
        setTimeout(() => setMensagem(''), 3000);
      } else {
        setMensagem(`Erro ao excluir produto: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setMensagem('Ocorreu um erro ao excluir o produto.');
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="cadastro-container">
        <div className="cadastro-header">
          <h1>Cadastrar Produto</h1>
          <p>Adicione novos produtos ao catálogo</p>
        </div>

        {mensagem && (
          <div className={`mensagem ${mensagem.includes('sucesso') || mensagem.includes('cadastrado') ? 'sucesso' : 'erro'}`}>
            {mensagem}
          </div>
        )}

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Coca-Cola Lata"
              required
              disabled={carregando}
            />
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
              required
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              disabled={carregando}
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
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
              disabled={carregando}
            />
          </div>

          <button 
            type="submit" 
            className="btn-cadastrar"
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar Produto'}
          </button>
        </form>

        <div className="produtos-cadastrados">
          <h2>Produtos Cadastrados ({produtosCadastrados.length})</h2>
          <p>Estes são os produtos adicionados por você:</p>
          
          {produtosCadastrados.length === 0 ? (
            <p className="nenhum-produto">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="lista-produtos">
              {produtosCadastrados.map(produto => (
                <div key={produto.id} className="produto-item">
                  <div className="produto-info">
                    <strong>{produto.nome}</strong>
                    <span>R$ {produto.preco.toFixed(2)}</span>
                    <span className="categoria-badge">{categorias.find(c => c.value === produto.categoria)?.label}</span>
                  </div>
                  <button 
                    className="btn-excluir"
                    onClick={() => handleExcluirProduto(produto.id)}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastroProduto;
