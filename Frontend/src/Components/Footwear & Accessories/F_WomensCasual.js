import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import styled from 'styled-components';
import sw from '../../assets/sw.jpg';
import slipper from '../../assets/slipper.jpg';
import wb from '../../assets/wb.webp';

// Container for the entire page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  margin: 0;
  padding-top: 50px;
`;

// Quote section
const Quote = styled.h2`
  margin-bottom: 30px;
  margin-top: 70px;
  color: #333;
  font-size: 1.8rem;
  text-align: center;
  padding: 0 20px;
`;

// Row container for categories
const Row = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
  margin-bottom: 30px;
`;

// Styled image box for categories with a black label
const ImageBox = styled.div`
  width: 300px;  /* Increased size */
  height: 300px; /* Increased size */
  background-size: cover;
  background-position: center;
  position: relative; /* Needed for overlay */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem; /* Adjusted font size */
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
  cursor: pointer; /* Add cursor pointer to show it's clickable */
`;

// Black label with partial transparency
const BlackLabel = styled.div`
  position: absolute;
  width: 100%;
  background: rgba(0, 0, 0, 0.7); /* Black with 70% opacity */
  color: white;
  text-align: center;
  padding: 10px 0;
  text-transform: uppercase;
  font-size: 1.5rem; /* Adjusted font size */
  bottom: 0;
  z-index: 2; /* Ensure label is above the overlay */
`;

const F_WomensCasual = () => {
  const navigate = useNavigate(); // Declare the navigate function

  const handleBootsClick = () => {
    navigate('/F_WomensCasualBoots'); // Navigate to F_WomensCasualBoots component
  };

  return (
    <Container>
      <Quote>Elevate Your Everyday Style – Discover the Perfect Blend of Comfort and Class</Quote>
      <Row>
        <ImageBox style={{ backgroundImage: `url(${sw})` }}>
          <BlackLabel>Sneakers</BlackLabel>
        </ImageBox>
        <ImageBox style={{ backgroundImage: `url(${slipper})` }}>
          <BlackLabel>Slippers</BlackLabel>
        </ImageBox>
        <ImageBox style={{ backgroundImage: `url(${wb})` }} onClick={handleBootsClick}>
          <BlackLabel>Boots</BlackLabel>
        </ImageBox>
      </Row>
      {/* Add more rows as needed */}
    </Container>
  );
};

export default F_WomensCasual;
