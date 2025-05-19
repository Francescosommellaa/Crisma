import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getBrands = async () => {
  const response = await axios.get(`${API_URL}/brands`);
  return response.data;
};

export const createBrand = async (data: { nome: string; abbreviazione: string }) => {
  const response = await axios.post(`${API_URL}/brands`, data);
  return response.data;
};

export const updateBrand = async (id: number, data: { nome: string; abbreviazione: string }) => {
  const response = await axios.put(`${API_URL}/brands/${id}`, data);
  return response.data;
};

export const deleteBrand = async (id: number) => {
  const response = await axios.delete(`${API_URL}/brands/${id}`);
  return response.data;
};
