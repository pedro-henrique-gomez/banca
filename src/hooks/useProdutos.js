import { useState, useEffect } from 'react';
import ProdutoService from '../services/produtoService';
import MigracaoService from '../services/migracaoService';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [migracaoStatus, setMigracaoStatus] = useState(null);

  // Carregar produtos do banco de dados
  const carregarProdutos = async () => {
    // Evitar múltiplas execuções simultâneas
    if (carregando) {
      console.log('Já está carregando produtos, aguardando...');
      return;
    }
    
    setCarregando(true);
    setErro(null);
    
    try {
      console.log('Iniciando carregamento de produtos...');
      
      // FORÇAR limpeza completa e migração para garantir dados corretos
      console.log('Forçando limpeza completa e migração...');
      
      // Limpar banco completamente
      const resultadoLimpeza = await MigracaoService.limparDuplicatas();
      console.log('Resultado da limpeza:', resultadoLimpeza.message);
      
      // Forçar migração completa
      const migracaoResultado = await MigracaoService.forcarMigracao();
      
      if (!migracaoResultado.success) {
        console.error('Erro na migração:', migracaoResultado.error);
        setErro('Erro na migração de produtos');
        return;
      }
      
      setMigracaoStatus(migracaoResultado.message);
      
      // Carregar produtos do banco IndexedDB
      const resultadoDB = await ProdutoService.listarProdutos();
      
      if (resultadoDB.success) {
        console.log('Produtos carregados:', resultadoDB.data.length);
        
        // Verificar duplicatas no resultado
        const produtosUnicos = [];
        const nomesVistos = new Set();
        
        resultadoDB.data.forEach(produto => {
          if (!nomesVistos.has(produto.nome)) {
            nomesVistos.add(produto.nome);
            produtosUnicos.push(produto);
          } else {
            console.log('Produto duplicado encontrado no resultado, removendo:', produto.nome);
          }
        });
        
        console.log('Produtos únicos após filtro:', produtosUnicos.length);
        setProdutos(produtosUnicos);
      } else {
        setErro(resultadoDB.error);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErro('Erro ao carregar produtos');
    } finally {
      setCarregando(false);
    }
  };

  // Adicionar novo produto
  const adicionarProduto = async (produtoData) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const resultado = await ProdutoService.adicionarProduto(produtoData);
      
      if (resultado.success) {
        await carregarProdutos(); // Recarregar lista
        return { success: true };
      } else {
        setErro(resultado.error);
        return { success: false, error: resultado.error };
      }
    } catch (error) {
      const mensagemErro = 'Erro ao adicionar produto';
      setErro(mensagemErro);
      return { success: false, error: mensagemErro };
    } finally {
      setCarregando(false);
    }
  };

  // Excluir produto
  const excluirProduto = async (id) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const resultado = await ProdutoService.excluirProduto(id);
      
      if (resultado.success) {
        await carregarProdutos(); // Recarregar lista
        return { success: true };
      } else {
        setErro(resultado.error);
        return { success: false, error: resultado.error };
      }
    } catch (error) {
      const mensagemErro = 'Erro ao excluir produto';
      setErro(mensagemErro);
      return { success: false, error: mensagemErro };
    } finally {
      setCarregando(false);
    }
  };

  // Forçar migração
  const forcarMigracao = async () => {
    setCarregando(true);
    setErro(null);
    
    try {
      const resultado = await MigracaoService.forcarMigracao();
      
      if (resultado.success) {
        setMigracaoStatus(resultado.message);
        await carregarProdutos();
        return { success: true, message: resultado.message };
      } else {
        setErro(resultado.error);
        return { success: false, error: resultado.error };
      }
    } catch (error) {
      const mensagemErro = 'Erro ao forçar migração';
      setErro(mensagemErro);
      return { success: false, error: mensagemErro };
    } finally {
      setCarregando(false);
    }
  };

  // Obter status da migração
  const obterStatusMigracao = async () => {
    try {
      const resultado = await MigracaoService.obterStatusMigracao();
      return resultado;
    } catch (error) {
      console.error('Erro ao obter status:', error);
      return { success: false, error: error.message };
    }
  };

  // Carregar produtos ao montar o hook
  useEffect(() => {
    carregarProdutos();
  }, []);

  return {
    produtos,
    carregando,
    erro,
    migracaoStatus,
    carregarProdutos,
    adicionarProduto,
    excluirProduto,
    forcarMigracao,
    obterStatusMigracao
  };
};
