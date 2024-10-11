import React, { useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';


const NavBar = () => {
 

  return (
    <nav className="navbar">
     
      <ul className="nav-links">
       
        <li><Link to="/">Items</Link></li>
        <li><Link to="/cart">Favorite</Link></li>
      </ul>
      
      <div className="nav-icons">
        
      </div>
    </nav>
  );
}

export default NavBar;
