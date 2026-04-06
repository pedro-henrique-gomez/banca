import db from './db';

class ConfiguracaoService {
  // Obter configuração por chave
  static async obterConfiguracao(chave) {
    try {
      const configuracao = await db.configuracoes.get(chave);
      return { success: true, data: configuracao?.valor };
    } catch (error) {
      console.error('Erro ao obter configuração:', error);
      // Fallback para localStorage
      const valor = localStorage.getItem(`config_${chave}`);
      return { success: true, data: valor };
    }
  }

  // Salvar configuração
  static async salvarConfiguracao(chave, valor) {
    try {
      const configuracao = {
        id: chave,
        chave,
        valor,
        dataAtualizacao: new Date().toISOString()
      };
      
      await db.configuracoes.put(configuracao);
      
      // Manter fallback no localStorage também
      localStorage.setItem(`config_${chave}`, valor);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      // Fallback para localStorage
      localStorage.setItem(`config_${chave}`, valor);
      return { success: true };
    }
  }

  // Obter tema
  static async obterTema() {
    const resultado = await this.obterConfiguracao('tema');
    return resultado.data || 'dark';
  }

  // Salvar tema
  static async salvarTema(tema) {
    return await this.salvarConfiguracao('tema', tema);
  }

  // Obter todas as configurações
  static async obterTodasConfiguracoes() {
    try {
      const configuracoes = await db.configuracoes.toArray();
      const configObj = {};
      
      configuracoes.forEach(config => {
        configObj[config.chave] = config.valor;
      });
      
      return { success: true, data: configObj };
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      return { success: false, error: error.message };
    }
  }

  // Limpar configurações
  static async limparConfiguracoes() {
    try {
      await db.configuracoes.clear();
      
      // Limpar localStorage também
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('config_')) {
          localStorage.removeItem(key);
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao limpar configurações:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ConfiguracaoService;
