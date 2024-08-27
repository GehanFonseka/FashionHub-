import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/home/Header'; 
import HeroSection from './Components/home/HeroSection';


import F_Home from './Components/Footwear & Accessories/F_Home';
import F_MensCasualAndFormal from './Components/Footwear & Accessories/F_Men\'sCasualAndFormal';
import F_WomensCasualAndFormal from './Components/Footwear & Accessories/F_Women\'sCasualAndFormal';
import A_Home from './Components/Footwear & Accessories/A_Home';





import Sidebar from './Components/salon/Sidebar';
import Footer from './Components/home/Footer';


//salon
import AppointmentForm from './Components/salon/AppointmentForm';
import Salonhome from './Components/salon/Salonhome';
import ServiceList from './Components/salon/ServiceList';
import MyAppointmentForm from './Components/salon/MyAppointmentForm';

 








//review
import ReviewForm from './Components/Review/ReviewForm';





function App() {
  return (
    <Router>
      <Header />
      <Routes>

        <Route path="/" element={<HeroSection />} />
        <Route path="/salon" element={<><Sidebar /><Salonhome /></>} />
        <Route path="/ServiceList" element={<><Sidebar /><ServiceList /></>} />
        <Route path="/AppointmentForm" element={<><Sidebar /><AppointmentForm /></>} />
        <Route path="/MyAppointmentForm" element={<><Sidebar /><MyAppointmentForm /></>} />

      

      <Route path="/" element={<HeroSection/>} />
      <Route path="/F_Home" element={<F_Home/>} />
      <Route path="/F_MensCasualAndFormal" element={<F_MensCasualAndFormal/>} />
      <Route path="F_WomensCasualAndFormal" element={<F_WomensCasualAndFormal/>} />
      <Route path="/A_Home" element={<A_Home/>} />




      




      <Route path="/" element={<ReviewForm />} />

      
      

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
