import React, { useState } from 'react';
import './CapoFormStepper.scss';
import {type CapoFormData } from '../../../types/capo';

  interface CapoFormStepperProps {
    onSubmit: (data: CapoFormData) => Promise<void>;
    onCancel: () => void;
  }

const steps = [
  { key: 'categoria', label: 'Categoria', required: true, validator: (v: string) => v.length > 0 && v.length <= 3 },
  { key: 'base', label: 'Base', required: true },
  { key: 'descrizione', label: 'Descrizione', required: true },
  { key: 'tm', label: 'TM', required: true },
  { key: 'prezzo', label: 'Prezzo', required: true, validator: (v: string) => !isNaN(Number(v)) },
  { key: 'taglia', label: 'Taglia', required: true },
  { key: 'tm2', label: 'TM2', required: false },
  { key: 'fornitoreTex', label: 'Fornitore Tex', required: false },
  { key: 'fornitore', label: 'Fornitore', required: false },
  { key: 'prezzo2', label: 'Prezzo 2', required: false, validator: (v: string) => v === '' || !isNaN(Number(v)) },
  { key: 'codiceColoreCampione', label: 'Codice Colore Campione', required: false },
  { key: 'varianti', label: 'Varianti', required: false },
  { key: 'pacchetto', label: 'Pacchetto', required: false }
];

const CapoFormStepper: React.FC<CapoFormStepperProps> = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CapoFormData>({} as CapoFormData);
  const [inputValue, setInputValue] = useState('');
  
  const step = steps[currentStep];
  const value = inputValue.trim();

  const isValid = !step.required || (step.validator ? step.validator(value) : value.length > 0);

  const handleNext = () => {
    const updatedData = { ...formData, [step.key]: value };
    setFormData(updatedData);
    setInputValue('');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onCancel();
    } else {
      setCurrentStep(currentStep - 1);
      setInputValue(String(formData[steps[currentStep - 1].key] ?? ''));

    }
  };

  return (
    <div className="capo-form-stepper">
      <h3>{step.label}</h3>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="actions">
        <button onClick={handleBack}>Indietro</button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
        >
          {currentStep < steps.length - 1 ? 'Avanti' : 'Conferma'}
        </button>
      </div>
    </div>
  );
};

export default CapoFormStepper;
