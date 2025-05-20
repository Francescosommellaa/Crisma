import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(email, password);
      localStorage.setItem('email', email); // Salva l'email
      navigate('/verify');
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.startsWith('verify:')) {
          const emailToVerify = err.message.split(':')[1];
          localStorage.setItem('email', emailToVerify); // Salva l'email
          navigate('/verify');
        } else {
          setError(err.message);
        }
      } else {
        setError('Errore sconosciuto');
      }
    }
  };
  

  return (
    <div>
      <h2>Registrazione</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrati</button>
    </div>
  );
};

export default RegisterPage;
