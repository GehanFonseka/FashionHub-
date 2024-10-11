import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "./ItemCard";
import "./Itemlist.css";

const ItemList = () => {
  const [products, setProducts] = useState({
    category1: [],
    category2: [],
    category3: [],
  });

  const [selectedItems, setSelectedItems] = useState({
    shirt: null,
    trouser: null,
    shoe: null,
  });

  const [shirtMinPrice, setShirtMinPrice] = useState("");
  const [shirtMaxPrice, setShirtMaxPrice] = useState("");
  const [trouserMinPrice, setTrouserMinPrice] = useState("");
  const [trouserMaxPrice, setTrouserMaxPrice] = useState("");
  const [shoeMinPrice, setShoeMinPrice] = useState("");
  const [shoeMaxPrice, setShoeMaxPrice] = useState("");

  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  // Fetching products from 3 different APIs and setting them into categories
  useEffect(() => {
    const fetchCategory1Products = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/shirts");
        return response.data;
      } catch (error) {
        console.error("Error fetching category 1 products:", error);
        return [];
      }
    };

    const fetchCategory2Products = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pants");
        return response.data;
      } catch (error) {
        console.error("Error fetching category 2 products:", error);
        return [];
      }
    };

    const fetchCategory3Products = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sneakers");
        return response.data;
      } catch (error) {
        console.error("Error fetching category 3 products:", error);
        return [];
      }
    };

    const fetchAllProducts = async () => {
      const [category1, category2, category3] = await Promise.all([
        fetchCategory1Products(),
        fetchCategory2Products(),
        fetchCategory3Products(),
      ]);
      setProducts({ category1, category2, category3 });
    };

    fetchAllProducts();
  }, []);

  const filterProducts = (products) => {
    const filterCategory = (categoryProducts, minPrice, maxPrice) => {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      return categoryProducts.filter(
        (product) => product.price >= min && product.price <= max
      );
    };

    return {
      category1: filterCategory(
        products.category1,
        shirtMinPrice,
        shirtMaxPrice
      ),
      category2: filterCategory(
        products.category2,
        trouserMinPrice,
        trouserMaxPrice
      ),
      category3: filterCategory(products.category3, shoeMinPrice, shoeMaxPrice),
    };
  };

  const filteredProducts = filterProducts(products);

  // Filter products based on the search term
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

  const handleRemoveItem = (itemType, item) => {
    switch (itemType) {
      case "shirt":
        handleRemove("shirt");
        break;
      case "trouser":
        handleRemove("trouser");
        break;
      case "shoe":
        handleRemove("shoe");
        break;
      default:
        break;
    }
  };
  
  

  const handleAddToFavorites = async () => {
    const totalBudget =
      (selectedItems.shirt ? selectedItems.shirt.price : 0) +
      (selectedItems.trouser ? selectedItems.trouser.price : 0) +
      (selectedItems.shoe ? selectedItems.shoe.price : 0);

    const items = {
      shirt: selectedItems.shirt ? selectedItems.shirt._id : null,
      trouser: selectedItems.trouser ? selectedItems.trouser._id : null,
      shoe: selectedItems.shoe ? selectedItems.shoe._id : null,
    };

    // Prompt the user for a package name
  const packageName = prompt("Please enter a name for your favorite package:");
  if (!packageName) {
    alert("Package name cannot be empty. Please try again.");
    return; // Exit if no name is provided
  }

    try {
      await axios.post("http://localhost:5000/api/favoritePackages/save", {
        items,
        budget: totalBudget,
        name: packageName, // Include the package name
      });
      alert("Items added to favorites with a total budget of " + totalBudget);
    } catch (err) {
      console.error("Error adding items to favorites:", err);
      alert("Failed to add items to favorites. Please try again.");
    }
  };

  if (
    products.category1.length === 0 &&
    products.category2.length === 0 &&
    products.category3.length === 0
  ) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <br />
      <br />
      <br />
      <br />

      {/* Add the search bar */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="filters-container">
        <div className="filter-category justify-center text-center">
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
        <div className="filter-category justify-center text-center">
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
        <div className="filter-category justify-center text-center">
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
        <div className="category-section overflow-y-hidden">
          <h2 className="text-center">Shirts</h2>
          {searchedProducts.category1.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onSelect={() => handleSelect("shirt", item)}
              isSelected={
                selectedItems.shirt && selectedItems.shirt._id === item._id
              }
            />
          ))}
        </div>
        <div className="category-section">
          <h2 className="text-center">Trousers</h2>
          {searchedProducts.category2.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onSelect={() => handleSelect("trouser", item)}
              isSelected={
                selectedItems.trouser && selectedItems.trouser._id === item._id
              }
            />
          ))}
        </div>
        <div className="category-section">
          <h2 className="text-center">Shoes</h2>
          {searchedProducts.category3.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onSelect={() => handleSelect("shoe", item)}
              isSelected={
                selectedItems.shoe && selectedItems.shoe._id === item._id
              }
            />
          ))}
        </div>
      </div>

      <div className="selected-items-overlay">
        {selectedItems.shirt && (
          <div className="selected-item">
            <span>Shirt: {selectedItems.shirt.name}</span>
            <button
              className="remove-button"
              onClick={() => handleRemoveItem("shirt",selectedItems.shirt)}
            >
              ✕
            </button>
          </div>
        )}
        {selectedItems.trouser && (
          <div className="selected-item">
            <span>Trousers: {selectedItems.trouser.name}</span>
            <button
              className="remove-button"
              onClick={() => handleRemoveItem("trouser",selectedItems.trouser)}
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
              onClick={() => handleRemoveItem("shoe",selectedItems.shoe)}
            >
              ✕
            </button>
          </div>
        )}
        {(selectedItems.shirt ||
          selectedItems.trouser ||
          selectedItems.shoe) && (
          <button
            className="add-to-favorites-button"
            onClick={handleAddToFavorites}
          >
            Add to Favorites
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemList;
