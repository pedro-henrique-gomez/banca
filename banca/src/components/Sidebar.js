import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Adiciona classe ao body quando o sidebar é colapsado
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { path: '/', label: 'Catálogo', icon: '📦', tooltip: 'Catálogo de Produtos' },
    { path: '/cadastro', label: 'Gerenciar Produtos', icon: '📋', tooltip: 'Gerenciar Produtos' },
    { path: '/configuracoes', label: 'Configurações', icon: '⚙️', tooltip: 'Configurações do Sistema' }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h2>Menu</h2>}
          <button 
            className="sidebar-toggle-btn" 
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {isCollapsed ? '☰' : '☰'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              title={isCollapsed ? item.tooltip : ''}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!isCollapsed && (
                <span className="sidebar-label">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
