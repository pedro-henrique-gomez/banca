import db from './db';

class ProdutoService {
  // Adicionar novo produto
  static async adicionarProduto(produto) {
    try {
      const produtoComData = {
        ...produto,
        dataCadastro: new Date().toISOString()
      };
      
      const id = await db.produtos.add(produtoComData);
      return { success: true, id };
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return { success: false, error: error.message };
    }
  }

  // Listar todos os produtos
  static async listarProdutos() {
    try {
      const produtos = await db.produtos.toArray();
      return { success: true, data: produtos };
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar produto por ID
  static async buscarProdutoPorId(id) {
    try {
      const produto = await db.produtos.get(id);
      return { success: true, data: produto };
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return { success: false, error: error.message };
    }
  }

  // Atualizar produto
  static async atualizarProduto(id, produto) {
    try {
      await db.produtos.update(id, produto);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return { success: false, error: error.message };
    }
  }

  // Excluir produto
  static async excluirProduto(id) {
    try {
      await db.produtos.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar produtos por categoria
  static async buscarPorCategoria(categoria) {
    try {
      const produtos = await db.produtos.where('categoria').equals(categoria).toArray();
      return { success: true, data: produtos };
    } catch (error) {
      console.error('Erro ao buscar por categoria:', error);
      return { success: false, error: error.message };
    }
  }

  // Limpar todos os produtos
  static async limparProdutos() {
    try {
      await db.produtos.clear();
      return { success: true };
    } catch (error) {
      console.error('Erro ao limpar produtos:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ProdutoService;
