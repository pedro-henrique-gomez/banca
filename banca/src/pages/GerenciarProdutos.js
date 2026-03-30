import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import ProdutoForm from '../components/ProdutoForm';
import ProdutoService from '../services/produtoService';
import './GerenciarProdutos.css';

const GerenciarProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const categorias = {
    'cigarro': 'Cigarros',
    'bebida': 'Bebidas',
    'tabacaria': 'Tabacaria',
    'carta': 'Cartas',
    'acessorio': 'Acessórios'
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setCarregando(true);
    setErro(null);
    
    try {
      const resultado = await ProdutoService.listarProdutos();
      if (resultado.success) {
        setProdutos(resultado.data.sort((a, b) => b.id - a.id)); // Mais recentes primeiro
      } else {
        setErro(resultado.error);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErro('Erro ao carregar produtos');
    } finally {
      setCarregando(false);
    }
  };

  const handleNovoProduto = () => {
    setProdutoEditando(null);
    setModalOpen(true);
  };

  const handleEditarProduto = (produto) => {
    setProdutoEditando(produto);
    setModalOpen(true);
  };

  const handleSalvarProduto = async (produtoData) => {
    try {
      let resultado;
      
      if (produtoEditando) {
        // Atualizar produto existente
        resultado = await ProdutoService.atualizarProduto(produtoEditando.id, produtoData);
        if (resultado.success) {
          setMensagem('Produto atualizado com sucesso!');
        }
      } else {
        // Adicionar novo produto
        resultado = await ProdutoService.adicionarProduto(produtoData);
        if (resultado.success) {
          setMensagem('Produto cadastrado com sucesso!');
        }
      }

      if (resultado.success) {
        setModalOpen(false);
        setProdutoEditando(null);
        await carregarProdutos();
        setTimeout(() => setMensagem(''), 3000);
      } else {
        setMensagem(`Erro: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setMensagem('Ocorreu um erro ao salvar o produto');
    }
  };

  const handleExcluirProduto = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      return;
    }

    try {
      const resultado = await ProdutoService.excluirProduto(id);
      if (resultado.success) {
        setMensagem('Produto excluído com sucesso!');
        await carregarProdutos();
        setTimeout(() => setMensagem(''), 3000);
      } else {
        setMensagem(`Erro ao excluir: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      setMensagem('Ocorreu um erro ao excluir o produto');
    }
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setProdutoEditando(null);
  };

  const formatarPreco = (preco) => {
    return `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  if (carregando && produtos.length === 0) {
    return (
      <div>
        <Sidebar />
        <div className="gerenciar-container">
          <div className="loading">
            <p>Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div>
        <Sidebar />
        <div className="gerenciar-container">
          <div className="error">
            <p>Erro: {erro}</p>
            <button onClick={carregarProdutos}>Tentar novamente</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="gerenciar-container">
        <div className="gerenciar-header">
          <h1>Gerenciar Produtos</h1>
          <p>Adicione, edite ou exclua produtos do catálogo</p>
        </div>

        {mensagem && (
          <div className={`mensagem ${mensagem.includes('sucesso') || mensagem.includes('cadastrado') || mensagem.includes('atualizado') || mensagem.includes('excluído') ? 'sucesso' : 'erro'}`}>
            {mensagem}
          </div>
        )}

        <div className="tabela-actions">
          <button className="btn-novo" onClick={handleNovoProduto}>
            ➕ Novo Produto
          </button>
          <div className="contador">
            Total: {produtos.length} produtos
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="nenhum-produto">
            <p>Nenhum produto cadastrado ainda.</p>
            <button className="btn-novo" onClick={handleNovoProduto}>
              Cadastrar primeiro produto
            </button>
          </div>
        ) : (
          <div className="tabela-wrapper">
            <table className="produtos-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id}>
                    <td className="nome-cell">
                      <div className="produto-info">
                        {produto.img && (
                          <img 
                            src={produto.img} 
                            alt={produto.nome}
                            className="produto-imagem"
                            onError={(e) => {
                              e.target.src = '/images/generic-product.svg';
                            }}
                          />
                        )}
                        <span>{produto.nome}</span>
                      </div>
                    </td>
                    <td className="preco-cell">{formatarPreco(produto.preco)}</td>
                    <td className="categoria-cell">
                      <span className="categoria-badge">
                        {categorias[produto.categoria] || produto.categoria}
                      </span>
                    </td>
                    <td className="data-cell">{formatarData(produto.dataCadastro)}</td>
                    <td className="acoes-cell">
                      <button 
                        className="btn-editar"
                        onClick={() => handleEditarProduto(produto)}
                        title="Editar produto"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-excluir"
                        onClick={() => handleExcluirProduto(produto.id, produto.nome)}
                        title="Excluir produto"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={handleCancelar}
          title={produtoEditando ? 'Editar Produto' : 'Cadastrar Produto'}
        >
          <ProdutoForm
            produto={produtoEditando}
            onSave={handleSalvarProduto}
            onCancel={handleCancelar}
          />
        </Modal>
      </div>
    </div>
  );
};

export default GerenciarProdutos;
