export interface GarmentColumn {
    key: keyof import('../types/Garment').Garment;
    label: string;
  }
  
  const GarmentTable: GarmentColumn[] = [
    { key: 'categoria', label: 'Categoria' },
    { key: 'base', label: 'Base' },
    { key: 'descrizione', label: 'Descrizione' },
    { key: 'gestionale', label: 'Gestionale' },
    { key: 'marka', label: 'Marka' },
    { key: 'codiceColoreCampione', label: 'Cod. ColoreC' },
    { key: 'coloreCampione', label: 'ColoreC' },
    { key: 'varianti', label: 'Varianti' },
    { key: 'tm', label: 'TM' },
    { key: 'fornitoreTex', label: 'FornitoreTex' },
    { key: 'prezzoTex', label: 'PrezzoTex' },
    { key: 'tm2', label: 'TM2' },
    { key: 'fornitore', label: 'Fornitore' },
    { key: 'prezzo', label: 'Prezzo' },
    { key: 'taglia', label: 'Taglia' },
    { key: 'pacchetto', label: 'Pacchetto' },
  ];
  
  export default GarmentTable;
  