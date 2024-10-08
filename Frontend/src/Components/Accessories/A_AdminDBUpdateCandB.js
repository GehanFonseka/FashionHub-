import React, { useState, useEffect } from 'react';
import axios from '../../utilities/axios';

const A_AdminDBUpdateCandB = ({ candB, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    sellerNo: '',
    itemNo: '',
    name: '',
    price: '',
    description: '',
    image: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (candB) {
      setFormData({
        sellerNo: candB.sellerNo || '',
        itemNo: candB.itemNo || '',
        name: candB.name || '',
        price: candB.price || '',
        description: candB.description || '',
        image: candB.image || '',
      });
    }
  }, [candB]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/chainsandbracelets/${candB._id}`, formData); // Adjusted to update Chains and Bracelets
      onUpdate(); // Notify parent component of the update
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating Chains and Bracelets item:", error);
      setError("Failed to update Chains and Bracelets item. Please try again.");
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <span style={styles.close} onClick={onClose}>&times;</span>
        <h2>Update Chains and Bracelets</h2> {/* Update the title */}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Seller No:
            <input
              type="text"
              name="sellerNo"
              value={formData.sellerNo}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>
          <label>
            Item No:
            <input
              type="text"
              name="itemNo"
              value={formData.itemNo}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ ...styles.input, height: '120px' }} // Increased height for better visibility
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.submitButton}>Update</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the modal is on top
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '800px', // Increased width for the modal
    maxWidth: '95vw', // Ensure it does not exceed the viewport width
    boxSizing: 'border-box',
    minWidth: '600px', // Ensure a minimum width for better appearance
  },
  close: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '20px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  submitButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default A_AdminDBUpdateCandB;
