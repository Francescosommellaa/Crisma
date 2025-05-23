export interface Garment {
  idGarment: number;
  abbreviazione: string;
  codiceColoreCampione: string;
  coloreCampione: string;
  varianti?: string;
  pacchetto?: string;
  categoria: string;
  tm: string;
  base: string;
  descrizione: string;
  prezzo?: number | null;
  prezzoTex?: number | null;
  taglia?: string;
  tm2?: string;
  fornitore?: string;
  fornitoreTex?: string;
  gestionale: string;
  marka: string;
}