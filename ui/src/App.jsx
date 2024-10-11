import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";

import Footer from "./components/Footer";
import FavoritePackagesPage from "./components/FavoritePackagesPage";
import ItemList from "./components/ItemList";
import EditPackagePage from "./components/EditPackagePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/cart" element={<FavoritePackagesPage />} />
          <Route path="/edit-package/:id" element={<EditPackagePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
