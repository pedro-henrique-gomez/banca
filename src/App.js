import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Categorias from './components/Categorias';
import ListaProdutos from './components/ListaProdutos';
import Carrinho from './components/Carrinho';
import Sidebar from './components/Sidebar';
import Catalogo from './pages/Catalogo';
import GerenciarProdutos from './pages/GerenciarProdutos';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { produtos, WHATSAPP } from './data/produtos';
import { useProdutos } from './hooks/useProdutos';
import './index.css';

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [buscaAtual, setBuscaAtual] = useState("");
  const [categoriaAtual, setCategoriaAtual] = useState("todos");
  const [cartOpen, setCartOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [pagamento, setPagamento] = useState("Dinheiro");

  // Hook personalizado para gerenciar produtos
  const { produtos: todosProdutos, carregando: carregandoProdutos } = useProdutos();

  useEffect(() => {
    const savedCart = localStorage.getItem("carrinho");
    if (savedCart) {
      setCarrinho(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  // 🔥 SOLUÇÃO PROFISSIONAL - AJUSTE AUTOMÁTICO DO ESPAÇO DO HEADER
  useEffect(() => {
    const ajustarEspaco = () => {
      const header = document.getElementById("header");
      if (header) {
        document.body.style.paddingTop = header.offsetHeight + "px";
      }
    };

    // Ajusta no carregamento
    ajustarEspaco();
    
    // Ajusta no resize
    window.addEventListener("resize", ajustarEspaco);
    
    // Limpa o listener
    return () => window.removeEventListener("resize", ajustarEspaco);
  }, []);

  const produtosFiltrados = todosProdutos.filter(p =>
    (categoriaAtual === "todos" || p.categoria === categoriaAtual) &&
    p.nome.toLowerCase().includes(buscaAtual.toLowerCase())
  );

  const add = (nome, preco) => {
    setCarrinho(prevCarrinho => {
      const item = prevCarrinho.find(i => i.nome === nome);
      if (item) {
        return prevCarrinho.map(i =>
          i.nome === nome ? { ...i, qtd: i.qtd + 1 } : i
        );
      } else {
        return [...prevCarrinho, { nome, preco, qtd: 1 }];
      }
    });
  };

  const menosCard = (nome) => {
    setCarrinho(prevCarrinho => {
      const item = prevCarrinho.find(i => i.nome === nome);
      if (!item) return prevCarrinho;

      if (item.qtd <= 1) {
        return prevCarrinho.filter(i => i.nome !== nome);
      } else {
        return prevCarrinho.map(i =>
          i.nome === nome ? { ...i, qtd: i.qtd - 1 } : i
        );
      }
    });
  };

  const mais = (index) => {
    setCarrinho(prevCarrinho =>
      prevCarrinho.map((item, i) =>
        i === index ? { ...item, qtd: item.qtd + 1 } : item
      )
    );
  };

  const menos = (index) => {
    setCarrinho(prevCarrinho => {
      if (prevCarrinho[index].qtd <= 1) {
        return prevCarrinho.filter((_, i) => i !== index);
      } else {
        return prevCarrinho.map((item, i) =>
          i === index ? { ...item, qtd: item.qtd - 1 } : item
        );
      }
    });
  };

  const total = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
  const qtdTotal = carrinho.reduce((s, i) => s + i.qtd, 0);

  const toggle = () => {
    setCartOpen(!cartOpen);
  };

  const enviar = () => {
    if (!nome || !endereco) {
      alert("Preencha nome e endereço!");
      return;
    }

    let msg = "Pedido:%0A";

    carrinho.forEach(i => {
      msg += `- ${i.nome} x${i.qtd}%0A`;
    });

    msg += `%0ATotal: R$${total.toFixed(2)}`;
    msg += `%0A%0ANome: ${nome}`;
    msg += `%0AEndereço: ${endereco}`;
    msg += `%0APagamento: ${pagamento}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`);
  };

  const catalogoProps = {
    carrinho,
    buscaAtual,
    categoriaAtual,
    cartOpen,
    nome,
    endereco,
    pagamento,
    onBuscaChange: setBuscaAtual,
    onCategoriaChange: setCategoriaAtual,
    onCartToggle: toggle,
    add,
    menosCard,
    mais,
    menos,
    total,
    qtdTotal,
    onNomeChange: setNome,
    onEnderecoChange: setEndereco,
    onPagamentoChange: setPagamento,
    enviar
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Catalogo {...catalogoProps} />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rotas de Admin Protegidas */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirecionar rotas antigas para o novo sistema de admin */}
            <Route path="/cadastro" element={<Navigate to="/admin/produtos" replace />} />
            <Route path="/configuracoes" element={<Navigate to="/admin/configuracoes" replace />} />
            
            {/* Página não encontrada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Analytics />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
