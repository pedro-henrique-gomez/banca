import React from 'react';

const Carrinho = ({ 
  isOpen, 
  carrinho, 
  total, 
  onClose, 
  onMais, 
  onMenos, 
  onEnviar, 
  nome, 
  endereco, 
  pagamento, 
  onNomeChange, 
  onEnderecoChange, 
  onPagamentoChange 
}) => {
  return (
    <>
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      
      <div className={`carrinho ${isOpen ? 'active' : ''}`} id="carrinho">
        <div className="carrinho-header">
          <h2>Seu pedido</h2>
          <button className="fechar" onClick={onClose}>✖</button>
        </div>

        <div id="itens">
          {carrinho.map((item, index) => (
            <div key={index} className="item">
              <strong>{item.nome}</strong>
              <div className="controls">
                <button onClick={() => onMenos(index)}>-</button>
                <span>{item.qtd}</span>
                <button onClick={() => onMais(index)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="total" id="total">
          Total: R$ {total.toFixed(2)}
        </div>

        <div className="checkout">
          <input 
            id="nome" 
            placeholder="Seu nome" 
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
          />
          <input 
            id="endereco" 
            placeholder="Endereço" 
            value={endereco}
            onChange={(e) => onEnderecoChange(e.target.value)}
          />

          <select 
            id="pagamento" 
            value={pagamento}
            onChange={(e) => onPagamentoChange(e.target.value)}
          >
            <option>Dinheiro</option>
            <option>Pix</option>
            <option>Cartão</option>
          </select>

          <button className="whatsapp" onClick={onEnviar}>
            Finalizar Pedido
          </button>
        </div>
      </div>
    </>
  );
};

export default Carrinho;
