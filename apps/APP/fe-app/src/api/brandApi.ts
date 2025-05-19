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

export const createBrand = async (data: { nome: string; abbreviazione: string }) => {
  try {
    const response = await axios.post(`${API_URL}/brands`, data);
    return response.data;
  } catch (error) {
    console.error('Errore durante la creazione del brand:', error);
    throw error;
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
