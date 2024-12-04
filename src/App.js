import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AddProduct from "./components/AddProduct";
import ProductPicker from "./components/productpicker/ProductPicker";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the AddProduct component */}
        <Route path="/" element={<AddProduct />} />

        {/* Route for the ProductPicker component */}
        <Route path="/product-picker" element={<ProductPicker />} />

        {/* Redirect all unmatched routes to the AddProduct screen */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
