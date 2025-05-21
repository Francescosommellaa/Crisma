import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getBrands = async () => {
  const response = await axios.get(`${API_URL}/brands`);
  return response.data;
};

export const createBrand = async (nome: string, abbreviazione: string) => {
  const response = await axios.post(`${API_URL}/brands`, { nome, abbreviazione });
  return response.data;
};

export const updateBrand = async (id: number, nome: string, abbreviazione: string) => {
  const response = await axios.put(`${API_URL}/brands/${id}`, { nome, abbreviazione });
  return response.data;
};

export const deleteBrand = async (id: number) => {
  const response = await axios.delete(`${API_URL}/brands/${id}`);
  return response.data;
};
