import React, { createContext, useContext, useEffect, useState } from 'react';
import ConfiguracaoService from '../services/configuracaoService';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  // Carregar tema do IndexedDB ao montar
  useEffect(() => {
    const carregarTema = async () => {
      try {
        const temaSalvo = await ConfiguracaoService.obterTema();
        setTheme(temaSalvo);
        document.documentElement.setAttribute('data-theme', temaSalvo);
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
        // Usar tema padrão
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } finally {
        setLoading(false);
      }
    };

    carregarTema();
  }, []);

  // Aplicar tema ao DOM quando mudar
  useEffect(() => {
    if (!loading) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, loading]);

  // Salvar tema quando mudar
  useEffect(() => {
    if (!loading) {
      const salvarTema = async () => {
        try {
          await ConfiguracaoService.salvarTema(theme);
        } catch (error) {
          console.error('Erro ao salvar tema:', error);
          // Fallback para localStorage
          localStorage.setItem('theme', theme);
        }
      };

      salvarTema();
    }
  }, [theme, loading]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const setThemeExplicit = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeExplicit,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
