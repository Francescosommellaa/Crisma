import React from 'react';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Hero from '../../components/Organisms/Hero/Hero';
import Faq from '../../components/Organisms/Faq/Faq';
import Footer from '../../components/Layout/Footer/Footer';
import Sidebar from '../../components/Layout/Sidebar/Sidebar';

const Home: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const toggleHandler = () => setSidebarOpen(prev => !prev);
    document.addEventListener('toggleSidebar', toggleHandler);
    return () => document.removeEventListener('toggleSidebar', toggleHandler);
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <section id="hero">
        <Hero />
      </section>
      <section id="faq">
        <Faq />
      </section>
      <section id="footer">
        <Footer />
      </section>
    </>
  );
};

export default Home;
