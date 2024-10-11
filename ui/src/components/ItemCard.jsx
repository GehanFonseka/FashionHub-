import React from "react";
import "./ItemCard.css"; // Ensure CSS is imported

const ItemCard = ({ item, onSelect, isSelected }) => {
  return (
    <div
      className={`item-card ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <img src={item.image[0]} alt={item.name} />
      <h3>{item.name}</h3>
      <p className="price">Rs. {item.price}</p>
      {/* Optional button for additional actions */}
      <button
        onClick={(e) => {
          e.stopPropagation(); /* Prevent card click */
        }}
      >
        View Details
      </button>
    </div>
  );
};

export default ItemCard;
