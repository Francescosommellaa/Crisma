import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/brands`);
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero dei brand:', error);
    throw error;
  }
};

export const createBrand = async (nome: string, abbreviazione: string) => {
  try {
    const response = await axios.post(`${API_URL}/brands`, { nome, abbreviazione });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Errore durante la creazione del brand');
    }
    throw new Error('Errore di connessione');
  }
};

export const updateBrand = async (id: number, data: { nome: string; abbreviazione: string }) => {
  try {
    const response = await axios.put(`${API_URL}/brands/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del brand:', error);
    throw error;
  }
};

export const deleteBrand = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'eliminazione del brand:', error);
    throw error;
  }
};
