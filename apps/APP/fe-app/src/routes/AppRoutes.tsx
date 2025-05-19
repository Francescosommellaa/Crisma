import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../components/pages/LoginPage';
import DashboardPage from '../components/pages/DashboardPage';
import RegisterPage from '../components/pages/RegisterPage';
import VerifyCodePage from '../components/pages/VerifyCodePage';
import BackButton from '../components/atoms/BackButton/BackButton';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={
              <LoginPage />
          }
        />
        <Route path="/register" element={
            <>
              <BackButton />
              <RegisterPage />
            </>
          } 
        />
        <Route path="/verify" element={
            <>
              <BackButton />
              <VerifyCodePage />
            </>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
