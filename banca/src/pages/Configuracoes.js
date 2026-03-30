import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import ConfiguracaoService from '../services/configuracaoService';
import MigracaoService from '../services/migracaoService';
import './Configuracoes.css';

const Configuracoes = () => {
  const { theme, toggleTheme, loading: loadingTheme } = useTheme();
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [migracaoStatus, setMigracaoStatus] = useState(null);

  const handleThemeChange = (novoTema) => {
    console.log('handleThemeChange chamado com:', novoTema, 'tema atual:', theme, 'carregando:', carregando);
    
    // Evitar múltiplos cliques simultâneos
    if (carregando) {
      console.log('Bloqueado - está carregando');
      return;
    }

    setCarregando(true);
    setMensagem('');
    
    try {
      // Sempre usar o toggleTheme do contexto que já salva automaticamente
      if (novoTema === 'dark' && theme === 'light') {
        console.log('Mudando para dark');
        toggleTheme();
        setMensagem('Tema alterado para Dark Mode!');
      } else if (novoTema === 'light' && theme === 'dark') {
        console.log('Mudando para light');
        toggleTheme();
        setMensagem('Tema alterado para Light Mode!');
      } else {
        // Se clicar no mesmo tema, apenas mostra mensagem de confirmação
        console.log('Mesmo tema clicado');
        setMensagem(`Você já está usando ${novoTema === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
      }
    } catch (error) {
      console.error('Erro ao alterar tema:', error);
      setMensagem('Erro ao alterar tema. Tente novamente.');
    } finally {
      setCarregando(false);
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  const limparDados = async () => {
    if (!window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      return;
    }

    setCarregando(true);
    setMensagem('');
    
    try {
      await ConfiguracaoService.limparConfiguracoes();
      setMensagem('Dados limpos com sucesso!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      setMensagem('Erro ao limpar dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const forcarMigracao = async () => {
    if (!window.confirm('Tem certeza que deseja forçar a migração? Isso irá limpar e recriar todos os produtos.')) {
      return;
    }

    setCarregando(true);
    setMensagem('');
    
    try {
      // Adicionar debug
      console.log('Iniciando migração forçada...');
      
      const resultado = await MigracaoService.forcarMigracao();
      
      if (resultado.success) {
        setMigracaoStatus(resultado.message);
        setMensagem('Migração forçada com sucesso!');
        
        // Debug adicional
        await MigracaoService.debugListarProdutos();
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMensagem(`Erro na migração: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Erro ao forçar migração:', error);
      setMensagem('Erro ao forçar migração. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const verificarStatusMigracao = async () => {
    setCarregando(true);
    
    try {
      const resultado = await MigracaoService.obterStatusMigracao();
      
      if (resultado.success) {
        const { produtosOriginais, produtosBanco, migrado, status } = resultado.data;
        setMigracaoStatus(`${status}: ${produtosBanco}/${produtosOriginais} produtos`);
        
        // Debug adicional
        console.log('Verificando produtos no banco...');
        await MigracaoService.debugListarProdutos();
      } else {
        setMigracaoStatus('Erro ao verificar status');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setMigracaoStatus('Erro ao verificar status');
    } finally {
      setCarregando(false);
    }
  };

  // Carregar status da migração ao montar
  React.useEffect(() => {
    verificarStatusMigracao();
  }, []);

  if (loadingTheme) {
    return (
      <div>
        <Sidebar />
        <div className="config-container">
          <div className="loading">
            <p>Carregando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="config-container">
        <div className="config-header">
          <h1>Configurações</h1>
          <p>Personalize sua experiência</p>
        </div>

        {mensagem && (
          <div className={`mensagem ${mensagem.includes('sucesso') || mensagem.includes('limpos') || mensagem.includes('alterado') || mensagem.includes('Migração') ? 'sucesso' : mensagem.includes('erro') ? 'erro' : 'info'}`}>
            {mensagem}
          </div>
        )}

        <div className="config-section">
          <h2>Aparência</h2>
          <p>Escolha o tema visual da aplicação</p>
          
          <div className="theme-selector">
            <div className="theme-option">
              <label htmlFor="dark-theme">
                <input
                  type="radio"
                  id="dark-theme"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                  disabled={carregando}
                />
                <div className="theme-card">
                  <div className="theme-preview dark">
                    <div className="preview-header"></div>
                    <div className="preview-content"></div>
                  </div>
                  <div className="theme-name">Dark Mode</div>
                  <div className="theme-description">Tema escuro para melhor conforto visual</div>
                </div>
              </label>
            </div>

            <div className="theme-option">
              <label htmlFor="light-theme">
                <input
                  type="radio"
                  id="light-theme"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                  disabled={carregando}
                />
                <div className="theme-card">
                  <div className="theme-preview light">
                    <div className="preview-header"></div>
                    <div className="preview-content"></div>
                  </div>
                  <div className="theme-name">Light Mode</div>
                  <div className="theme-description">Tema claro para ambientes bem iluminados</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h2>Migração de Dados</h2>
          <p>Gerencie a migração de produtos para o banco de dados</p>
          
          <div className="migracao-info">
            <div className="info-item">
              <strong>Status:</strong> {migracaoStatus || 'Verificando...'}
            </div>
          </div>

          <div className="migracao-actions">
            <button 
              className="btn-primary"
              onClick={verificarStatusMigracao}
              disabled={carregando}
            >
              🔄 Verificar Status
            </button>
            <button 
              className="btn-warning"
              onClick={forcarMigracao}
              disabled={carregando}
            >
              🔄 Forçar Migração
            </button>
          </div>
          
          <p className="warning">
            ⚠️ Forçar migração irá limpar todos os produtos existentes e recriá-los.
          </p>
        </div>

        <div className="config-section">
          <h2>Sobre a Aplicação</h2>
          <p>Informações sobre o sistema</p>
          
          <div className="app-info">
            <div className="info-item">
              <strong>Versão:</strong> 1.0.0
            </div>
            <div className="info-item">
              <strong>Banco de Dados:</strong> IndexedDB (Dexie)
            </div>
            <div className="info-item">
              <strong>Tecnologias:</strong> React, CSS3, IndexedDB
            </div>
            <div className="info-item">
              <strong>Armazenamento:</strong> Local no navegador
            </div>
          </div>
        </div>

        <div className="config-section">
          <h2>Atalhos</h2>
          <p>Comandos rápidos para melhor produtividade</p>
          
          <div className="shortcuts">
            <div className="shortcut-item">
              <kbd>N</kbd>
              <span>Navegar para catálogo</span>
            </div>
            <div className="shortcut-item">
              <kbd>G</kbd>
              <span>Gerenciar produtos</span>
            </div>
            <div className="shortcut-item">
              <kbd>C</kbd>
              <span>Configurações</span>
            </div>
            <div className="shortcut-item">
              <kbd>ESC</kbd>
              <span>Fechar modal</span>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h2>Gerenciamento de Dados</h2>
          <p>Opções para gerenciar seus dados</p>
          
          <div className="data-actions">
            <button 
              className="btn-danger"
              onClick={limparDados}
              disabled={carregando}
            >
              🗑️ Limpar Todos os Dados
            </button>
            <p className="warning">
              ⚠️ Esta ação irá excluir todos os produtos e configurações salvas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
