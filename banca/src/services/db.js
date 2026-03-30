import Dexie from 'dexie';

// Criar banco de dados
const db = new Dexie('bancaNoPontoDB');

// Definir schema do banco
db.version(1).stores({
  produtos: '++id, nome, preco, categoria, img, dataCadastro',
  configuracoes: 'id, chave, valor, dataAtualizacao'
});

export default db;
