import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const handleError = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data?.message || 'Errore sconosciuto';
  }
  return 'Errore di connessione';
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.redirectTo === 'verify') {
        throw new Error(`verify:${error.response.data.email}`);
      }
      throw new Error(error.response?.data?.message || 'Errore durante il login');
    }
    throw new Error('Errore di connessione');
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const verifyCode = async (email: string, code: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify`, { email, code });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

