export interface CapoFormData {
    categoria: string;
    base: string;
    descrizione: string;
    tm: string;
    prezzo: string;         // sarà convertito a numero nel backend
    taglia: string;
    tm2?: string;
    fornitoreTex?: string;
    fornitore?: string;
    prezzo2?: string;       // idem
    codiceColoreCampione?: string;
    varianti?: string;
    pacchetto?: string;
    fileId: number;

    [key: string]: string | number | undefined;
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