import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { verifyCode } from '../../api/authApi';

const VerifyCodePage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera l'email da localStorage
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setError('Email non trovata, ripeti il login.');
      navigate('/login');
    }
  }, [navigate]);

  const handleVerify = async () => {
    try {
      await verifyCode(email, code);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Errore sconosciuto');
      }
    }
  };

  return (
    <div>
      <h2>Verifica Codice</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Email: <strong>{email}</strong></p>
      <input
        type="text"
        placeholder="Codice"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleVerify}>Verifica</button>
    </div>
  );
};

export default VerifyCodePage;
