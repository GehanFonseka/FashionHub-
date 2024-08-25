import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/home/Header'; 
import HeroSection from './Components/home/HeroSection';

import Footer from './Components/home/Footer';

 





function App() {
  return (
    <Router>
      <Header />
      <Routes>

        <Route path="/" element={<HeroSection />} />
      

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
