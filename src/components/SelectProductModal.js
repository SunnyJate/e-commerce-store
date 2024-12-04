import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/products.json";
import "./SelectProductModal.css";

const SelectProductModal = ({ onClose }) => {
  const [selectedProducts, setSelectedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const productsPerPage = 10;
  const navigate = useNavigate();

  const loadMoreProducts = useCallback(() => {
    const filteredProducts = productsData.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const start = currentPage * productsPerPage;
    const end = start + productsPerPage;
    const newProducts = filteredProducts.slice(start, end);
    setDisplayedProducts((prev) => [...prev, ...newProducts]);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadMoreProducts();
  }, [loadMoreProducts]);

  const toggleProductSelection = (productId, isChecked) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (isChecked) {
        updated[productId] = productsData.find((p) => p.id === productId).variants.map((v) => v.id);
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const toggleVariantSelection = (productId, variantId, isChecked) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (!updated[productId]) updated[productId] = [];

      if (isChecked) {
        updated[productId].push(variantId);
      } else {
        updated[productId] = updated[productId].filter((id) => id !== variantId);
        if (updated[productId].length === 0) delete updated[productId];
      }
      return updated;
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to the first page on search
    setDisplayedProducts([]); // Clear displayed products on search
  };

  const handleAdd = () => {
    const checkedProducts = Object.entries(selectedProducts)
      .filter(([_, variantIds]) => variantIds.length > 0)
      .map(([productId, variantIds]) => {
        const product = productsData.find((p) => p.id === parseInt(productId)); // Ensure productId is an integer
        if (!product) {
          console.error(`Product with ID ${productId} not found`);
          return null; // Return null if product is not found
        }
        return {
          ...product,
          selectedVariants: product.variants.filter((variant) => variantIds.includes(variant.id)),
        };
      })
      .filter(Boolean); // Remove any null values

    if (checkedProducts.length > 0) {
      navigate("/product-picker", { state: { checkedProducts } });
      onClose(); // Close the modal after adding
    } else {
      alert("No products selected");
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const selectedCount = Object.keys(selectedProducts).length;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onScroll={handleScroll}>
        <h2>Select Products</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Products"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="products-table">
          {displayedProducts.map((product) => (
            <div key={product.id} className="product">
              <div className="product-info">
                <input
                  type="checkbox"
                  checked={!!selectedProducts[product.id]}
                  onChange={(e) => toggleProductSelection(product.id, e.target.checked)}
                />
                <img src={product.image.src} alt={product.title} className="product-image" />
                <div>
                  <h3>{product.title}</h3>
                </div>
              </div>
              <div className="variants">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Variant Title</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProducts[product.id]?.includes(variant.id) || false}
                            onChange={(e) =>
                              toggleVariantSelection(product.id, variant.id, e.target.checked)
                            }
                          />
                        </td>
                        <td>{variant.title}</td>
                        <td>{variant.quantity}</td>
                        <td>{`₹${variant.price}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <div className="product-count">
            {`Selected Products: ${selectedCount}`}
          </div>
          <div className="modal-actions">
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleAdd} disabled={selectedCount === 0}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProductModal;