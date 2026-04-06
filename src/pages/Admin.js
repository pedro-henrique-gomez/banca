import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import GerenciarProdutos from './GerenciarProdutos';
import Configuracoes from './Configuracoes';
import Sidebar from '../components/Sidebar';
import './Admin.css';

const Admin = () => {
  return (
    <ProtectedRoute>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/produtos" replace />} />
            <Route path="/produtos" element={<GerenciarProdutos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
