import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditPackagePage.css";
import ItemCard from "./ItemCard";

const EditPackagePage = () => {
  const [packageData, setPackageData] = useState(null);
  const [products, setProducts] = useState({
    category1: [], // Shirts
    category2: [], // Trousers
    category3: [], // Shoes
  });

  const [selectedItems, setSelectedItems] = useState({
    shirt: null,
    trouser: null,
    shoe: null,
  });

  const [budget, setBudget] = useState(0); // Initialize budget as 0
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Filter and Search states
  const [shirtMinPrice, setShirtMinPrice] = useState("");
  const [shirtMaxPrice, setShirtMaxPrice] = useState("");
  const [trouserMinPrice, setTrouserMinPrice] = useState("");
  const [trouserMaxPrice, setTrouserMaxPrice] = useState("");
  const [shoeMinPrice, setShoeMinPrice] = useState("");
  const [shoeMaxPrice, setShoeMaxPrice] = useState("");
  
  const [searchTerm, setSearchTerm] = useState(""); // New search state

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/favoritePackages/${id}`
        );
        setPackageData(response.data);
        setSelectedItems({
          shirt: response.data.items.shirt || null,
          trouser: response.data.items.trouser || null,
          shoe: response.data.items.shoe || null,
        });
        setBudget(response.data.budget); // Set the budget from the fetched data
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const [pantsResponse, sneakersResponse, blazersResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/pants"),
          axios.get("http://localhost:5000/api/sneakers"),
          axios.get("http://localhost:5000/api/shirts"),
        ]);
    
        const categorizedProducts = {
          category1: blazersResponse.data, 
          category2: pantsResponse.data,
          category3: sneakersResponse.data
        };
    
        setProducts(categorizedProducts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPackage();
    fetchProducts();
  }, [id]);

  const filterProducts = (products) => {
    const filterCategory = (categoryProducts, minPrice, maxPrice) => {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      return categoryProducts.filter(
        (product) => product.price >= min && product.price <= max
      );
    };

    return {
      category1: filterCategory(products.category1, shirtMinPrice, shirtMaxPrice),
      category2: filterCategory(products.category2, trouserMinPrice, trouserMaxPrice),
      category3: filterCategory(products.category3, shoeMinPrice, shoeMaxPrice),
    };
  };

  const filteredProducts = filterProducts(products);

  // Add search functionality here
  const searchProducts = (products) => {
    const searchCategory = (categoryProducts) => {
      return categoryProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    return {
      category1: searchCategory(filteredProducts.category1),
      category2: searchCategory(filteredProducts.category2),
      category3: searchCategory(filteredProducts.category3),
    };
  };

  const searchedProducts = searchProducts(filteredProducts);

  const handleSave = async () => {
    try {
      const calculatedBudget = selectedItems.shirt?.price + selectedItems.trouser?.price + selectedItems.shoe?.price;
      await axios.put(
        `http://localhost:5000/api/favoritePackages/update/${id}`,
        {
          items: selectedItems,
          budget: calculatedBudget,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/cart");
    } catch (err) {
      setError("Error updating package.", err);
    }
  };

  const handleSelect = (category, item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: item,
    }));
  };

  const handleRemove = (category) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: null,
    }));
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-package-page">
      <h1>Edit Package</h1>

      {/* Add the search bar */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="filters-container">
        {/* Filters for shirts */}
        <div className="filter-category">
          <h3>Filter Shirts</h3>
          <label>
            Min Price:
            <input
              type="number"
              value={shirtMinPrice}
              onChange={(e) => setShirtMinPrice(e.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              value={shirtMaxPrice}
              onChange={(e) => setShirtMaxPrice(e.target.value)}
              placeholder="1000"
            />
          </label>
        </div>

        {/* Filters for trousers */}
        <div className="filter-category">
          <h3>Filter Trousers</h3>
          <label>
            Min Price:
            <input
              type="number"
              value={trouserMinPrice}
              onChange={(e) => setTrouserMinPrice(e.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              value={trouserMaxPrice}
              onChange={(e) => setTrouserMaxPrice(e.target.value)}
              placeholder="1000"
            />
          </label>
        </div>

        {/* Filters for shoes */}
        <div className="filter-category">
          <h3>Filter Shoes</h3>
          <label>
            Min Price:
            <input
              type="number"
              value={shoeMinPrice}
              onChange={(e) => setShoeMinPrice(e.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              value={shoeMaxPrice}
              onChange={(e) => setShoeMaxPrice(e.target.value)}
              placeholder="1000"
            />
          </label>
        </div>
      </div>

      <div className="grid-container">
        {/* Display searched products */}
        {Object.keys(searchedProducts).map((category, index) => (
          <div key={index} className="category-section">
            <h2>
              {category === "category1"
                ? "Shirts"
                : category === "category2"
                ? "Trousers"
                : "Shoes"}
            </h2>
            {searchedProducts[category].map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onSelect={() =>
                  handleSelect(
                    category === "category1"
                      ? "shirt"
                      : category === "category2"
                      ? "trouser"
                      : "shoe",
                    item
                  )
                }
                isSelected={
                  selectedItems[
                    category === "category1"
                      ? "shirt"
                      : category === "category2"
                      ? "trouser"
                      : "shoe"
                  ] &&
                  selectedItems[
                    category === "category1"
                      ? "shirt"
                      : category === "category2"
                      ? "trouser"
                      : "shoe"
                  ]._id === item._id
                }
              />
            ))}
          </div>
        ))}

        <div className="selected-items-overlay">
          {/* Display budget */}
          {budget && (
            <div className="budget-section">
              <h3>Budget: Rs. {budget}</h3>
            </div>
          )}

          {/* Selected items display */}
          {selectedItems.shirt && (
            <div className="selected-item">
              <span>Shirt: {selectedItems.shirt.name}</span>
              <button
                className="remove-button"
                onClick={() => handleRemove("shirt")}
              >
                ✕
              </button>
            </div>
          )}
          {selectedItems.trouser && (
            <div className="selected-item">
              <span>Trouser: {selectedItems.trouser.name}</span>
              <button
                className="remove-button"
                onClick={() => handleRemove("trouser")}
              >
                ✕
              </button>
            </div>
          )}
          {selectedItems.shoe && (
            <div className="selected-item">
              <span>Shoe: {selectedItems.shoe.name}</span>
              <button
                className="remove-button"
                onClick={() => handleRemove("shoe")}
              >
                ✕
              </button>
            </div>
          )}
          <button className="save-changes-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPackagePage;
