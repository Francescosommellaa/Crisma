import React, { useState } from 'react';
import { createGarment, type GarmentCreateInput } from '../../../api/garmentsApi';
import { type Garment } from '../../../types/Garment';
import axios from 'axios';

import Button from '../../atoms/Button/Button';
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
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const [form, setForm] = useState<GarmentCreateInput>({
    categoria: '',
    base: '',
    descrizione: '',
    tm: '',
    codiceColoreCampione: '',
    coloreCampione: '',
    taglia: 'S',
    varianti: '',
  });

  const handleChange = (field: keyof GarmentCreateInput, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!form.categoria.trim()) errors.push('categoria');
    if (!form.base.trim()) errors.push('base');
    if (!form.descrizione.trim()) errors.push('descrizione');
    if (!form.tm.toString().trim()) errors.push('tm');
    if (!form.codiceColoreCampione.trim()) errors.push('codiceColoreCampione');
    if (showColoreCampione && !form.coloreCampione?.trim()) errors.push('coloreCampione');

    if (errors.length > 0) {
      setInvalidFields(errors);
      if (errors.some((f) => ['categoria', 'base', 'descrizione', 'tm'].includes(f))) setStep(1);
      else if (errors.some((f) => ['codiceColoreCampione', 'coloreCampione'].includes(f))) setStep(2);
      else setStep(3);
      return false;
    }
    setInvalidFields([]);
    return true;
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
        varianti: form.varianti,
      };

      const garment = await createGarment(abbrev, fileId, payload);
      onSuccess(garment);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        if (msg?.includes('Codice colore')) {
          setShowColoreCampione(true);
          setStep(2);
          setInvalidFields((prev) => [...new Set([...prev, 'coloreCampione'])]);
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
    <div className="garment-modal-overlay">
      <div className="garment-form-stepper">
        <h3>Nuovo Capo <span className="step-info">– Step {step} di 3</span></h3>
        <div className="step-progress-bar">
          <div className="progress" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <form className="form-fields">
          {step === 1 && (
            <>
              <input className={invalidFields.includes('categoria') ? 'invalid' : ''} placeholder="Categoria*" value={form.categoria} onChange={(e) => handleChange('categoria', e.target.value)} />
              <input className={invalidFields.includes('base') ? 'invalid' : ''} placeholder="Base*" value={form.base} onChange={(e) => handleChange('base', e.target.value)} />
              <input className={invalidFields.includes('descrizione') ? 'invalid' : ''} placeholder="Descrizione*" value={form.descrizione} onChange={(e) => handleChange('descrizione', e.target.value)} />
              <input className={invalidFields.includes('tm') ? 'invalid no-spinner' : 'no-spinner'} placeholder="TM (es: 453)*" value={form.tm} maxLength={3} onChange={(e) => handleChange('tm', e.target.value)} type="number" min={0} max={999} />
            </>
          )}
          {step === 2 && (
            <>
              <input className={invalidFields.includes('codiceColoreCampione') ? 'invalid' : ''} placeholder="Codice Colore Campione*" value={form.codiceColoreCampione} onChange={(e) => handleChange('codiceColoreCampione', e.target.value)} />
              {showColoreCampione && (
                <input className={invalidFields.includes('coloreCampione') ? 'invalid' : ''} placeholder="Nome Colore Campione*" value={form.coloreCampione || ''} onChange={(e) => handleChange('coloreCampione', e.target.value)} />
              )}
              <input placeholder="Varianti (es: 12, 443-12)" value={form.varianti || ''} onChange={(e) => handleChange('varianti', e.target.value)} />
              <input placeholder="Pacchetto" value={form.pacchetto || ''} onChange={(e) => handleChange('pacchetto', e.target.value)} />
            </>
          )}
          {step === 3 && (
            <>
              <input type="number" step="0.001" placeholder="Prezzo" value={form.prezzo ?? ''} onChange={(e) => handleChange('prezzo', parseFloat(e.target.value))} />
              <input type="number" step="0.001" placeholder="Prezzo Tex" value={form.prezzoTex ?? ''} onChange={(e) => handleChange('prezzoTex', parseFloat(e.target.value))} />
              <input className={invalidFields.includes('taglia') ? 'invalid' : ''} placeholder="Taglia" value={form.taglia || ''} onChange={(e) => handleChange('taglia', e.target.value)} />
              <input placeholder="TM2" maxLength={3} value={form.tm2 || ''} onChange={(e) => handleChange('tm2', e.target.value)} type="number" min={0} max={999} className="no-spinner" />
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
    </div>
  );
};

export default GarmentFormStepper;
