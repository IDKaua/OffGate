import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await authService.login(username, password);
      localStorage.setItem('@OffGate:token', token); // Salva o crachá no navegador
      onLogin(); // Libera o acesso para o Dashboard
      toast.success('Acesso liberado!');
    } catch (error) {
      toast.error('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">OffGate</h2>
          <p className="text-sm text-gray-400 mt-1">Insira suas credenciais para acessar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400">Usuário</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 bg-dark-900 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-dark-900 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all cursor-pointer"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}