import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Styles
import '../styles/main.scss';

// Pages
import WelcomePage from '../components/pages/WelcomePage/WelcomePage';
import BrandListPage from '../components/pages/BrandListPage/BrandListPage';
import FileListPage from '../components/pages/FileListPage/FileListPage';
import CapiTablePage from '../components/pages/GarmentsTablePage/GarmentsTablePage';

// Atoms
import Button from '../components/atoms/Button/Button';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/brands" element={<BrandListPage />} />
        <Route path="/:abbreviazione/files" element={<><Button label='Torna ai Brand' onClick={() => window.history.back()}/><FileListPage /></>} />
        <Route path="/:abbrev/files/:fileId/garments" element={<><Button label='Torna ai File' onClick={() => window.history.back()} /><CapiTablePage /></>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
