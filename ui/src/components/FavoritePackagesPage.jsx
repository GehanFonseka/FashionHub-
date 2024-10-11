import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FavoritePackagesPage.css";
import jsPDF from 'jspdf';

const FavoritePackagesPage = () => {
  const [favoritePackages, setFavoritePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [comparisonItems, setComparisonItems] = useState([]);

  useEffect(() => {
    const fetchFavoritePackages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/favoritePackages"
        );
        setFavoritePackages(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePackages();
  }, []);

  const deletePackage = async (packageId) => {
    const confirmed = window.confirm("Are you sure you want to delete this package?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/favoritePackages/delete/${packageId}`);
      setFavoritePackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg._id !== packageId)
      );
    } catch (err) {
      console.error("Error deleting package:", err);
      setError("Error deleting package.");
    }
  };

  // Function to handle adding all items to the cart
  const addToCart = async (pkg) => {
    try {
      const addItemPromises = [];

      if (pkg.items.shirt) {
        const shirtItem = pkg.items.shirt;
        const shirtCartItem = {
          ItemsN: shirtItem.name,
          price: shirtItem.price,
          quantity: 1,
          image: shirtItem.images || [],
          sellerNo: shirtItem.sellerNo || pkg.sellerNo,
        };
        addItemPromises.push(axios.post("http://localhost:5000/api/cart/add", shirtCartItem));
      }

      if (pkg.items.trouser) {
        const trouserItem = pkg.items.trouser;
        const trouserCartItem = {
          ItemsN: trouserItem.name,
          price: trouserItem.price,
          quantity: 1,
          image: trouserItem.images || [],
          sellerNo: trouserItem.sellerNo || pkg.sellerNo,
        };
        addItemPromises.push(axios.post("http://localhost:5000/api/cart/add", trouserCartItem));
      }

      if (pkg.items.shoe) {
        const shoeItem = pkg.items.shoe;
        const shoeCartItem = {
          ItemsN: shoeItem.name,
          price: shoeItem.price,
          quantity: 1,
          image: shoeItem.images || [],
          sellerNo: shoeItem.sellerNo || pkg.sellerNo,
        };
        addItemPromises.push(axios.post("http://localhost:5000/api/cart/add", shoeCartItem));
      }

      await Promise.all(addItemPromises);
      alert("All items have been added to the cart!");
    } catch (err) {
      console.error("Error adding items to cart:", err);
      alert("Failed to add items to cart. Please try again.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 10; // Starting Y position for the text
  
    doc.setFontSize(16);
    doc.text("Favorite Packages Report", 10, yPosition);
  
    yPosition += 10; // Add space after the title
  
    favoritePackages.forEach((pkg, index) => {
      doc.setFontSize(12);
      doc.text(`Package: ${pkg.name} - Budget: Rs. ${pkg.budget}`, 10, yPosition);
      yPosition += 10; // Add space after each package
  
      // For each item in the package, print details and increment the Y position
      Object.keys(pkg.items).forEach((itemKey, itemIndex) => {
        const item = pkg.items[itemKey];
        doc.text(`${itemKey}: ${item.name} - Price: Rs. ${item.price}`, 10, yPosition);
        yPosition += 10; // Add space between each item
  
        // Check if yPosition goes beyond the page height and add a new page if necessary
        if (yPosition >= 280) {
          doc.addPage();
          yPosition = 10; // Reset Y position for the new page
        }
      });
  
      yPosition += 10; // Add extra space after each package to separate them
  
      // Check if yPosition goes beyond the page height and add a new page if necessary
      if (yPosition >= 280) {
        doc.addPage();
        yPosition = 10; // Reset Y position for the new page
      }
    });
  
    doc.save("favorite-packages.pdf");
  };
  

  const filteredPackages = favoritePackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComparisonToggle = (item) => {
    if (comparisonItems.includes(item._id)) {
      setComparisonItems(comparisonItems.filter((id) => id !== item._id));
    } else {
      if (comparisonItems.length < 4) {
        setComparisonItems([...comparisonItems, item._id]);
      } else {
        alert("You can only compare up to 4 items.");
      }
    }
  };

  const ComparisonTable = () => {
    if (comparisonItems.length === 0) return null;

    const itemsToCompare = favoritePackages.filter((pkg) =>
      comparisonItems.includes(pkg._id)
    );

    return (
      <div className="comparison-table">
        <h2>Item Comparison</h2>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              {itemsToCompare.map((item) => (
                <th key={item._id}>{item.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Price</td>
              {itemsToCompare.map((item) => (
                <td key={item._id}>Rs. {item.budget}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="favorite-packages-container">
      <h1>Favorite Packages</h1>

      <input
        type="text"
        placeholder="Search by package name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="pdf-button-container">
          <button className="small-pdf-button" onClick={generatePDF}>
            Download PDF
          </button>
        </div>

      {filteredPackages.length === 0 ? (
        <p>No favorite packages found.</p>
      ) : (
        <div className="favorite-packages-list">
          {filteredPackages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              <div className="package-header">
                <div className="package-details">
                  <h2>{pkg.name}</h2>
                  <p className="package-budget">Budget: Rs. {pkg.budget}</p>
                </div>
                <div className="package-actions">
                  <Link to={`/edit-package/${pkg._id}`}>
                    <button className="edit-button">Edit</button>
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => deletePackage(pkg._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="package-items">
                {Object.keys(pkg.items).map((itemKey) => {
                  const item = pkg.items[itemKey];
                  if (!item) return null;

                  return (
                    <div key={item._id} className="item-card">
                      <h3>{item.name}</h3>
                      <p>Price: Rs. {item.price}</p>
                      <div className="item-images">
                        {item.images.map((img, index) => (
                          <img
                            key={index}
                            src={`/images/${img}`}
                            alt={`${item.name}-${index}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="package-actions-bottom">
                <input
                  type="checkbox"
                  checked={comparisonItems.includes(pkg._id)}
                  onChange={() => handleComparisonToggle(pkg)}
                />
                <button
                  className="add-to-cart-button"
                  onClick={() => addToCart(pkg)}
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ComparisonTable />
    </div>
  );
};

export default FavoritePackagesPage;
