import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createFile = async (
  abbreviazione: string,
  stagione: 'SS' | 'FW',
  anno: string
) => {
  const response = await axios.post(`${API_URL}/files`, {
    abbreviazione,
    stagione,
    anno
  });
  return response.data;
};

export const updateFile = async (
  nome: string,
  abbreviazione: string,
  stagione: 'SS' | 'FW',
  anno: string
) => {
  const response = await axios.put(`${API_URL}/files/${nome}`, {
    abbreviazione,
    stagione,
    anno
  });
  return response.data;
};

export const deleteFile = async (nome: string) => {
  const response = await axios.delete(`${API_URL}/files/${nome}`);
  return response.data;
};
