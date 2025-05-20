import axios from 'axios';
import {type CapoFormData } from '../types/capo';

const API_URL = import.meta.env.VITE_API_URL;

export const getCapiByFile = async (fileId: number) => {
  try {
    const response = await axios.get(`${API_URL}/capi`, {
      params: { fileId },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        throw new Error('Errore nel recupero dei capi');
    }
    throw new Error('Errore di connessione');
  }
};

export const createCapo = async (data: CapoFormData) => {
  const response = await axios.post(`${API_URL}/capi`, data);
  return response.data;
};
