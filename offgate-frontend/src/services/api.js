import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Anexa o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@OffGate:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// O serviço de Autenticação que o Login.jsx precisa!
// O serviço de Autenticação atualizado!
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (credentials) => {
    // Aponta para a rota de cadastro do seu Java
    const response = await api.post('/auth/register', credentials); 
    return response.data;
  }
};

// O serviço de Repositórios que o Dashboard.jsx precisa
export const repositoryService = {
  getAll: async () => {
    const response = await api.get('/repositories');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/repositories', data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/repositories/${id}`);
    return response.data;
  }
};

export default api;