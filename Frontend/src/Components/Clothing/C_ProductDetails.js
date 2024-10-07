import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'; // Import axios for HTTP requests


// Define styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  margin-top: 70px;
  gap: 40px;
  min-height: calc(100vh - 100px);
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
`;

const Details = styled.div`
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 50px;
`;

const Heading = styled.h2`
  margin-bottom: 20px;
  font-size: 2rem;
`;

const Price = styled.p`
  font-size: 1.4rem;
  color: green;
  margin: 10px 0;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #333;
`;

const ItemNo = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  margin: 10px 0;
`;

const AvailableQuantity = styled.p`
  font-size: 1.2rem;
  color: #333;
`;

const AddToCartButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  margin: 10px 0;
  padding: 10px;
  font-size: 1rem;
`;

const C_ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const navigate = useNavigate();

  useEffect(() => {
    const savedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    console.log("savedPRoduct",savedProduct)

    if (savedProduct) {
      setProduct(savedProduct);
      console.log("Saved Product:", savedProduct); // Debugging output
    } else {
      navigate('/');
    }

    setLoading(false);
  }, [navigate]);

  const handleAddToCart = async () => {
    const cartItem = {
      product,
      quantity,
      size,
    };
    console.log("Adding to cart:", cartItem);
    alert(`Item added to cart! Quantity: ${quantity}, Size: ${size}`);
    await axios.post('/api/cart/cart', cartItem);
    
    navigate('/cart', { state: cartItem });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  // New attribute for available quantity
  const availableQuantity = product.quantity; // Assuming this comes from the database

  return (
    <Container>
      <ImageContainer>
        <Image src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} />
      </ImageContainer>
      <Details>
        <Heading>{product.name}</Heading>
        <ItemNo>Item No: {product.itemNo}</ItemNo>
        <Description>{product.description}</Description>
        <Price>LKR {product.price}</Price>
        <AvailableQuantity>Available Quantity: {availableQuantity}</AvailableQuantity>
        
        {/* Size Selector */}
        <label htmlFor="size">Size:</label>
        <Select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </Select>

        {/* Quantity Selector */}
        <label htmlFor="quantity">Select Quantity:</label>
        <Select id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          {[...Array(availableQuantity).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>{num + 1}</option>
          ))}
        </Select>

        <AddToCartButton
          onClick={handleAddToCart}
          disabled={quantity > availableQuantity} 
        >
          Add to Cart
        </AddToCartButton>
      </Details>
    </Container>
  );
};

export default C_ProductDetails;
