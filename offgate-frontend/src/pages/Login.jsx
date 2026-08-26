import React, { useState } from 'react';
import { Activity, Shield, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

export function Login({ onLogin }) {
  // Estado para controlar se estamos na tela de Login ou Cadastro
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        // Fluxo de Cadastro
        await authService.register(formData);
        toast.success('Conta criada com sucesso! Faça o login.');
        setIsRegistering(false); // Volta para a tela de login
        setFormData({ ...formData, password: '' }); // Limpa a senha por segurança
      } else {
        // Fluxo de Login
        const response = await authService.login(formData);
        if (response && response.token) {
          localStorage.setItem('@OffGate:token', response.token);
          toast.success('Bem-vindo ao OffGate!');
          onLogin(response.token);
        } else {
          throw new Error('Token não recebido');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(isRegistering ? 'Erro ao criar conta. Verifique os dados.' : 'Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efeitos de luz no fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="p-8">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 mb-4">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">OffGate</h1>
            <p className="text-sm text-gray-400 text-center mt-2">
              {isRegistering 
                ? 'Crie sua conta para automatizar seu DevOps' 
                : 'Insira suas credenciais para acessar o motor de IA'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Usuário</label>
              <input 
                type="text" 
                required 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600"
                placeholder="Ex: admin"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Senha</label>
              <input 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-3 text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Processando...</span>
              ) : isRegistering ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Criar Conta</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>
          </form>

        </div>
        
        {/* Toggle para alternar entre Login e Cadastro */}
        <div className="px-8 py-5 bg-dark-900/50 border-t border-dark-700 flex justify-center">
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setFormData({ username: '', password: '' });
            }}
            className="text-sm text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer flex items-center space-x-1"
          >
            <span>
              {isRegistering ? 'Já tem uma conta? Faça Login' : 'Ainda não tem conta? Cadastre-se'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}