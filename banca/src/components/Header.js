import React from 'react';

const Header = ({ busca, onBuscaChange, contador, onCartToggle }) => {
  return (
    <header id="header">
      <div className="top-bar">
        <div className="logo-area">
          <img src="/images/logo.svg" alt="Logo" />
          <div>
            <strong>Banca no Ponto</strong>
            <p className="location">📍 Avenida Ernani do Amaral n° 207</p>
          </div>
        </div>

        <div className="cart-icon" onClick={onCartToggle}>
          🛒 <span id="contador">{contador}</span>
        </div>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          id="busca" 
          placeholder="Buscar produtos..." 
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;
