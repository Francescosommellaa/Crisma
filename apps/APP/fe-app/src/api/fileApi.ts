import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface FileItem {
  id: number;
  nome: string;
  brandAbbreviazione: string;
  stagione: 'SS' | 'FW';
  anno: string;
  createdAt: string;
}

export const getFilesByBrand = async (abbreviazione: string): Promise<FileItem[]> => {
  const response = await axios.get<FileItem[]>(`${API_URL}/files`);
  return response.data.filter((f) => f.brandAbbreviazione === abbreviazione);
};

export const getFileById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/files/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Errore nel recupero del file');
    }
  }
};

export const createFile = async (
  brandAbbreviazione: string,
  stagione: 'SS' | 'FW',
  anno: string
) => {
  try {
    const response = await axios.post(`${API_URL}/files`, {
      brandAbbreviazione,
      stagione,
      anno,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Errore nella creazione del file');
    }
    throw new Error('Errore di connessione');
  }
};

export const updateFile = async (
  id: number,
  brandAbbreviazione: string,
  stagione: 'SS' | 'FW',
  anno: string
) => {
  try {
    const response = await axios.put(`${API_URL}/files/${id}`, {
      brandAbbreviazione,
      stagione,
      anno,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message?.toLowerCase() || '';

      // match flessibile per errori da backend relativi ai duplicati
      if (msg.includes('esiste') && msg.includes('file')) {
        throw new Error('Un altro file con lo stesso nome è già esistente');
      }

      throw new Error('Errore nel salvare il file');
    }

    throw new Error('Errore di connessione');
  }
};

export const deleteFile = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/files/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Errore durante l\'eliminazione del file');
    }
    throw new Error('Errore di connessione');
  }
};