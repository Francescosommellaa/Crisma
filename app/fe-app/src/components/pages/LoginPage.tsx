import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('email', email); // Salva l'email
      navigate('/dashboard');
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
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate('/register')}>Crea Account</button>
    </div>
  );
};

export default LoginPage;
