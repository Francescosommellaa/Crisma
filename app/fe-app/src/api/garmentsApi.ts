import axios from 'axios';
import {type Garment } from '../types/Garment';

const API_URL = import.meta.env.VITE_API_URL;

export const getGarmentsByFile = async (
  abbrev: string,
  fileId: string
): Promise<Garment[]> => {
  const response = await axios.get<Garment[]>(
    `${API_URL}/garments/${abbrev}/${fileId}`
  );
  return response.data;
};

export type GarmentCreateInput = {
  categoria: string;
  base: string;
  descrizione: string;
  tm: string;
  codiceColoreCampione: string;
  coloreCampione?: string;
  varianti?: string;
  pacchetto?: string;
  prezzo?: number | null;
  prezzoTex?: number | null;
  taglia?: string;
  tm2?: string;
  fornitore?: string;
  fornitoreTex?: string;
};

export const createGarment = async (
  abbrev: string,
  fileId: string,
  data: GarmentCreateInput
): Promise<Garment> => {
  const response = await axios.post<Garment>(
    `${API_URL}/garments/${abbrev}/${fileId}`,
    data
  );
  return response.data;
};

export const updateGarment = async (
  abbrev: string,
  fileId: string,
  idGarment: number,
  data: Partial<Omit<Garment, 'idGarment' | 'gestionale' | 'marka' | 'abbreviazione'>>
): Promise<Garment> => {
  const response = await axios.put<Garment>(
    `${API_URL}/garments/${abbrev}/${fileId}/${idGarment}`,
    data
  );
  return response.data;
};

export const deleteGarment = async (
  abbrev: string,
  fileId: string,
  idGarment: number
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(
    `${API_URL}/garments/${abbrev}/${fileId}/${idGarment}`
  );
  return response.data;
};

export const exportGarmentsCSV = async (
  abbrev: string,
  fileId: string
): Promise<void> => {
  const url = `${API_URL}/garments/${abbrev}/${fileId}/export`;
  const response = await axios.get(url, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `garments-${fileId}.csv`;
  link.click();
};
