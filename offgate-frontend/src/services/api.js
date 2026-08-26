const API_URL = 'http://localhost:8080/api';

// Função para anexar o Token nas requisições automaticamente
const getHeaders = () => {
  const token = localStorage.getItem('@OffGate:token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Credenciais inválidas');
    return response.text(); // O Spring devolve o token como texto
  }
};

export const freelancerService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/freelancers`, { headers: getHeaders() });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  },
  create: async (data) => {
    const response = await fetch(`${API_URL}/freelancers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao salvar no servidor');
    return response.json();
  },
  revoke: async (id) => {
    const response = await fetch(`${API_URL}/freelancers/${id}/revoke`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao revogar acesso');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_URL}/freelancers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao excluir contrato');
  }
};