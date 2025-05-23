import React, { useState } from 'react';
import { createGarment,type GarmentCreateInput } from '../../../api/garmentsApi';
import {type Garment } from '../../../types/Garment';
import axios from 'axios';

// Atoms
import Button from '../../atoms/Button/Button';

//SCSS
import './GarmentFormStepper.scss';

interface Props {
  abbrev: string;
  fileId: string;
  onClose: () => void;
  onSuccess: (garment: Garment) => void;
}

const GarmentFormStepper: React.FC<Props> = ({ abbrev, fileId, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [showColoreCampione, setShowColoreCampione] = useState(false);

  const [form, setForm] = useState<GarmentCreateInput>({
    categoria: '',
    base: '',
    descrizione: '',
    tm: '',
    codiceColoreCampione: '',
    coloreCampione: '',
    taglia: 'S',
    varianti: ''
  });

  const handleChange = (field: keyof GarmentCreateInput, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const payload: GarmentCreateInput = {
        ...form,
        categoria: form.categoria.toUpperCase().trim(),
        base: form.base.trim(),
        descrizione: form.descrizione.trim(),
        tm: form.tm.padStart(3, '0'),
        tm2: form.tm2?.padStart(3, '0'),
        prezzo: form.prezzo ? parseFloat(form.prezzo.toString()) : undefined,
        prezzoTex: form.prezzoTex ? parseFloat(form.prezzoTex.toString()) : undefined,
        codiceColoreCampione: form.codiceColoreCampione.trim(),
        coloreCampione: form.coloreCampione?.trim(),
        varianti: form.varianti
      };

      const garment = await createGarment(abbrev, fileId, payload);
      onSuccess(garment);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        if (msg?.includes('Codice colore')) {
          setShowColoreCampione(true);
        } else {
          alert(msg || 'Errore creazione capo');
        }
        console.error(err);
      } else {
        alert('Errore generico');
        console.error(err);
      }
    }
  };

  return (
<div className="garment-form-stepper">
  <h3>Nuovo Capo <span className="step-info">– Step {step} di 3</span></h3>

  <form className="form-fields">
    {step === 1 && (
      <>
        <input placeholder="Categoria*" value={form.categoria} onChange={(e) => handleChange('categoria', e.target.value)} />
        <input placeholder="Base*" value={form.base} onChange={(e) => handleChange('base', e.target.value)} />
        <input placeholder="Descrizione*" value={form.descrizione} onChange={(e) => handleChange('descrizione', e.target.value)} />
        <input placeholder="TM (es: 453)*" value={form.tm} maxLength={3} onChange={(e) => handleChange('tm', e.target.value)} />
      </>
    )}

    {step === 2 && (
      <>
        <input placeholder="Codice Colore Campione*" value={form.codiceColoreCampione} onChange={(e) => handleChange('codiceColoreCampione', e.target.value)} />
        {showColoreCampione && (
          <input placeholder="Nome Colore Campione*" value={form.coloreCampione || ''} onChange={(e) => handleChange('coloreCampione', e.target.value)} />
        )}
        <input placeholder="Varianti (es: 12, 443-12)" value={form.varianti || ''} onChange={(e) => handleChange('varianti', e.target.value)} />
        <input placeholder="Pacchetto" value={form.pacchetto || ''} onChange={(e) => handleChange('pacchetto', e.target.value)} />
      </>
    )}

    {step === 3 && (
      <>
        <input type="number" step="0.001" placeholder="Prezzo" value={form.prezzo ?? ''} onChange={(e) => handleChange('prezzo', parseFloat(e.target.value))} />
        <input type="number" step="0.001" placeholder="Prezzo Tex" value={form.prezzoTex ?? ''} onChange={(e) => handleChange('prezzoTex', parseFloat(e.target.value))} />
        <input placeholder="Taglia" value={form.taglia || ''} onChange={(e) => handleChange('taglia', e.target.value)} />
        <input placeholder="TM2" maxLength={3} value={form.tm2 || ''} onChange={(e) => handleChange('tm2', e.target.value)} />
        <input placeholder="Fornitore" value={form.fornitore || ''} onChange={(e) => handleChange('fornitore', e.target.value)} />
        <input placeholder="Fornitore Tex" value={form.fornitoreTex || ''} onChange={(e) => handleChange('fornitoreTex', e.target.value)} />
      </>
    )}
  </form>

  <div className="stepper-actions">
    {step > 1 && <Button label="Indietro" type="secondary" size="l" onClick={prevStep} />}
    {step < 3 && <Button label="Avanti" type="primary" size="l" onClick={nextStep} />}
    {step === 3 && <Button label="Salva" type="primary" size="l" onClick={handleSubmit} />}
    <Button label="Annulla" type="secondary" size="l" onClick={onClose} />
  </div>
</div>
  );
};

export default GarmentFormStepper;
