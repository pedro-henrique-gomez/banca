import db from './db';
import { produtos as produtosOriginais } from '../data/produtos';
import ProdutoService from './produtoService';

class MigracaoService {
  // Verificar se já existem produtos no banco
  static async verificarProdutosExistentes() {
    try {
      const resultado = await ProdutoService.listarProdutos();
      return resultado.success && resultado.data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar produtos existentes:', error);
      return false;
    }
  }

  // Migrar produtos estáticos para o IndexedDB
  static async migrarProdutos() {
    try {
      console.log('Iniciando migração de produtos...');
      console.log('Produtos originais:', produtosOriginais.length);
      
      // FORÇAR limpeza completa para garantir dados atualizados
      await db.produtos.clear();
      console.log('Banco de dados limpo forçadamente');
      
      // Migrar cada produto original - garantir que não haja duplicatas
      const produtosMigrados = [];
      const nomesProcessados = new Set(); // Para evitar duplicatas
      
      for (const produto of produtosOriginais) {
        // Verificar se já processamos este produto
        if (nomesProcessados.has(produto.nome)) {
          console.log('Produto duplicado nos dados originais, pulando:', produto.nome);
          continue;
        }
        
        nomesProcessados.add(produto.nome);
        
        const produtoMigrado = {
          nome: produto.nome,
          preco: produto.preco,
          categoria: produto.categoria,
          img: produto.img,
          dataCadastro: new Date().toISOString()
        };
        
        console.log('Migrando produto:', produtoMigrado);
        
        // Inserir diretamente no banco para evitar problemas com o serviço
        const id = await db.produtos.add(produtoMigrado);
        
        if (id) {
          produtosMigrados.push({
            ...produtoMigrado,
            id: id
          });
          console.log(`Produto migrado com ID ${id}: ${produto.nome} (${produto.categoria})`);
        } else {
          console.error(`Erro ao migrar produto ${produto.nome}`);
        }
      }
      
      console.log(`Migração concluída! ${produtosMigrados.length} produtos migrados.`);
      
      // Verificar se todos foram migrados
      const resultadoVerificacao = await db.produtos.toArray();
      console.log('Total de produtos no banco após migração:', resultadoVerificacao.length);
      
      return {
        success: true,
        data: produtosMigrados,
        message: `${produtosMigrados.length} produtos migrados com sucesso!`
      };
      
    } catch (error) {
      console.error('Erro durante migração:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro durante migração de produtos'
      };
    }
  }

  // Verificar se migração é necessária e executar se preciso
  static async verificarEMigrar() {
    try {
      const produtosExistentes = await this.verificarProdutosExistentes();
      
      if (produtosExistentes) {
        console.log('Produtos já existem no banco, verificando necessidade de atualização...');
        
        // Verificar se há diferenças nos produtos
        const produtosBanco = await ProdutoService.listarProdutos();
        if (produtosBanco.success && produtosBanco.data.length > 0) {
          // Se já existem produtos, não migrar novamente
          console.log('Produtos já migrados anteriormente, pulando migração.');
          return {
            success: true,
            data: produtosBanco.data,
            message: `${produtosBanco.data.length} produtos já existem no banco`
          };
        }
      }
      
      // Se não existem produtos, migrar
      console.log('Nenhum produto encontrado, iniciando migração...');
      return await this.migrarProdutos();
      
    } catch (error) {
      console.error('Erro ao verificar e migrar:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro durante verificação e migração de produtos'
      };
    }
  }

  // Limpar produtos duplicados baseado no nome
  static async limparDuplicatas() {
    try {
      console.log('Limpando produtos duplicados...');
      
      // Obter todos os produtos
      const todosProdutos = await db.produtos.toArray();
      console.log('Total de produtos antes da limpeza:', todosProdutos.length);
      
      // Criar mapa para remover duplicatas (usar nome como chave)
      const produtosUnicos = new Map();
      
      todosProdutos.forEach(produto => {
        if (!produtosUnicos.has(produto.nome)) {
          produtosUnicos.set(produto.nome, produto);
        } else {
          console.log('Produto duplicado encontrado e removido:', produto.nome);
        }
      });
      
      // Limpar banco
      await db.produtos.clear();
      
      // Re inserir apenas produtos únicos
      const produtosFinais = Array.from(produtosUnicos.values());
      for (const produto of produtosFinais) {
        await db.produtos.add(produto);
      }
      
      console.log('Total de produtos após limpeza:', produtosFinais.length);
      console.log('Duplicatas removidas:', todosProdutos.length - produtosFinais.length);
      
      return {
        success: true,
        data: produtosFinais,
        message: `${produtosFinais.length} produtos únicos mantidos, ${todosProdutos.length - produtosFinais.length} duplicatas removidas`
      };
      
    } catch (error) {
      console.error('Erro ao limpar duplicatas:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro ao limpar produtos duplicados'
      };
    }
  }

  // Forçar migração (limpa e reinsere tudo)
  static async forcarMigracao() {
    try {
      console.log('Forçando migração completa...');
      
      // Limpar todos os produtos
      await db.produtos.clear();
      console.log('Banco limpo, iniciando migração forçada');
      
      // Migrar novamente
      return await this.migrarProdutos();
      
    } catch (error) {
      console.error('Erro ao forçar migração:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro ao forçar migração'
      };
    }
  }

  // Obter status da migração
  static async obterStatusMigracao() {
    try {
      const produtosOriginaisCount = produtosOriginais.length;
      
      // Contar produtos no banco diretamente
      const produtosBanco = await db.produtos.toArray();
      const produtosBancoCount = produtosBanco.length;
      
      console.log('Status da migração:');
      console.log('- Produtos originais:', produtosOriginaisCount);
      console.log('- Produtos no banco:', produtosBancoCount);
      
      return {
        success: true,
        data: {
          produtosOriginais: produtosOriginaisCount,
          produtosBanco: produtosBancoCount,
          migrado: produtosBancoCount >= produtosOriginaisCount,
          status: produtosBancoCount >= produtosOriginaisCount ? 
            'Migração concluída' : 
            'Migração necessária'
        }
      };
    } catch (error) {
      console.error('Erro ao obter status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Debug: listar todos os produtos no banco
  static async debugListarProdutos() {
    try {
      const produtos = await db.produtos.toArray();
      console.log('Produtos no banco de dados:');
      produtos.forEach((produto, index) => {
        console.log(`${index + 1}. ID: ${produto.id}, Nome: ${produto.nome}, Preço: ${produto.preco}, Categoria: ${produto.categoria}`);
      });
      return produtos;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return [];
    }
  }
}

export default MigracaoService;
