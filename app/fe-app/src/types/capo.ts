export interface CapoFormData {
  codiceColoreCampione: string;
  varianti: string;
  pacchetto?: string;
  categoria: string;
  tm: string;
  base: string;
  descrizione: string;
  prezzo?: string;
  prezzo2?: string;
  taglia?: string;
  tm2?: string;
  fornitore?: string;
  fornitore2?: string;
  fileId: number;
}

  export interface Capo {
    id: number;
    categoria: string;
    base: string;
    descrizione: string;
    tm: string;
    prezzo: number;
    taglia: string;
    tm2?: string;
    fornitoreTex?: string;
    fornitore?: string;
    prezzo2?: number;
    codiceColoreCampione?: string;
    varianti?: string;
    pacchetto?: string;
    brand: string;
    abbreviazione: string;
    gestionale: string;
    marka: string;
    createdAt: string;
  }