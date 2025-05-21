import React, { useState } from 'react';
import './CapoFormStepper.scss';
import {type CapoFormData } from '../../../types/capo';

interface Step {
  key: keyof CapoFormData;
  label: string;
  required: boolean;
  validator?: (value: string) => boolean;
}

interface Props {
  fileId: number;
  onSubmit: (data: CapoFormData) => void;
  onCancel: () => void;
}

const steps: Step[] = [
  { key: 'codiceColoreCampione', label: 'Codice Colore Campione', required: true },
  { key: 'varianti', label: 'Varianti', required: true },
  { key: 'pacchetto', label: 'Pacchetto', required: false },
  { key: 'categoria', label: 'Categoria', required: true },
  { key: 'tm', label: 'TM', required: true },
  { key: 'base', label: 'Base', required: true },
  { key: 'descrizione', label: 'Descrizione', required: true },
  { key: 'prezzo', label: 'Prezzo', required: false, validator: v => v === '' || !isNaN(Number(v)) },
  { key: 'prezzo2', label: 'Prezzo 2', required: false, validator: v => v === '' || !isNaN(Number(v)) },
  { key: 'taglia', label: 'Taglia', required: false },
  { key: 'tm2', label: 'TM2', required: false },
  { key: 'fornitore', label: 'Fornitore', required: false },
  { key: 'fornitore2', label: 'Fornitore 2', required: false }
];

const CapoFormStepper: React.FC<Props> = ({ fileId, onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CapoFormData>>({ fileId, taglia: 'S' });
  const [input, setInput] = useState('');

  const step = steps[currentStep];
  const isValid = !step.required || (step.validator ? step.validator(input) : input.trim() !== '');

  const handleNext = () => {
    const updated = { ...formData, [step.key]: input };
    setFormData(updated);
    setInput('');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(updated as CapoFormData);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return onCancel();
    const previous = steps[currentStep - 1];
    setInput((formData[previous.key] as string) || '');
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="capo-form-stepper">
      <h3>{step.label}</h3>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="actions">
        <button onClick={handleBack}>Indietro</button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          style={{ opacity: isValid ? 1 : 0.5 }}
        >
          {currentStep < steps.length - 1 ? 'Avanti' : 'Conferma'}
        </button>
      </div>
    </div>
  );
};

export default CapoFormStepper;
