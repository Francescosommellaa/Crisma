export const normalizeTM = (value?: string) =>
    value ? `TM${value.padStart(3, '0')}` : undefined;
  
  export const generateCodes = (
    abbrev: string,
    anno: string,
    stagione: string,
    id: number,
    categoria: string
  ) => {
    const cat = categoria.toUpperCase();
    return {
      gestionale: `${abbrev}${anno}${id}${cat}`,
      marka: `${stagione}${anno}${abbrev}-${id}${cat}`
    };
  };
  
  export const getGarmentsPath = (abbrev: string, fileId: string) =>
    ['brands', abbrev.toUpperCase(), 'files', fileId, 'garments', 'garments.json'];
  
  export const getMetadataPath = (abbrev: string, fileId: string) =>
    ['brands', abbrev.toUpperCase(), 'files', fileId, 'metadata.json'];
  
  export const buildGarment = (
    id: number,
    abbrev: string,
    anno: string,
    stagione: string,
    body: any,
    coloreCampione: string
  ) => {
    const { gestionale, marka } = generateCodes(
      abbrev,
      anno,
      stagione,
      id,
      body.categoria
    );
  
    return {
      idGarment: id,
      abbreviazione: abbrev,
      codiceColoreCampione: body.codiceColoreCampione,
      coloreCampione,
      varianti: body.varianti,
      pacchetto: body.pacchetto || '',
      categoria: body.categoria.toUpperCase(),
      tm: normalizeTM(body.tm),
      base: body.base,
      descrizione: body.descrizione,
      prezzo: parseFloat(body.prezzo) || null,
      prezzoTex: parseFloat(body.prezzoTex) || null,
      taglia: body.taglia || 'S',
      tm2: normalizeTM(body.tm2),
      fornitore: body.fornitore || '',
      fornitoreTex: body.fornitoreTex || '',
      gestionale,
      marka
    };
  };
  