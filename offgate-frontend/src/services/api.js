const API_URL = 'http://localhost:8080/api/freelancers';

export const freelancerService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        console.warn('Erro do servidor:', response.status);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.warn('Não foi possível conectar ao Java (8080):', error.message);
      return [];
    }
  },

  create: async (freelancerData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(freelancerData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro 400 do servidor Java:', errorText);
      throw new Error('Erro ao salvar no servidor');
    }
    return response.json();
  }
};