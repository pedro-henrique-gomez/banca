import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Adiciona classe ao body quando o sidebar é colapsado
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const menuItems = [
    { path: '/', label: 'Catálogo', icon: '📦', tooltip: 'Catálogo de Produtos' },
    { path: '/admin/produtos', label: 'Gerenciar Produtos', icon: '📋', tooltip: 'Gerenciar Produtos' },
    { path: '/admin/configuracoes', label: 'Configurações', icon: '⚙️', tooltip: 'Configurações do Sistema' }
  ];

  return (
    <>
      {/* Menu Hambúrguer para Mobile */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          title="Abrir Menu"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isMobileOpen ? 'mobile-open' : ''}`}>
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
              onClick={() => {
                if (isMobile) {
                  setIsMobileOpen(false);
                }
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!isCollapsed && (
                <span className="sidebar-label">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Botão de Logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title={isCollapsed ? 'Sair' : 'Sair do Sistema'}
          >
            <span className="sidebar-icon">🚪</span>
            {!isCollapsed && (
              <span className="sidebar-label">Sair</span>
            )}
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isMobile && isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
