import React, { useEffect, useState } from "react";
import "../styles/Modal.css";

function ProductModal({ onClose, onAdd }) {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      loadMoreProducts();
    }
  }, [products]);

  const loadMoreProducts = () => {
    setLoading(true);
    const newProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    setDisplayedProducts([...displayedProducts, ...newProducts]);
    setPage(page + 1);
    setLoading(false);
  };

  const handleScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      loadMoreProducts();
    }
  };

  const toggleSelection = (product, variant) => {
    const newSelection = { name: product.name, variant };
    const isSelected = selectedProducts.some(p => p.variant.id === variant.id);

    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.variant.id !== variant.id));
    } else {
      setSelectedProducts([...selectedProducts, newSelection]);
    }
  };

  const toggleAllVariants = (product) => {
    const allSelected = product.variants.every(variant => 
      selectedProducts.some(p => p.variant.id === variant.id));

    if (allSelected) {
      setSelectedProducts(selectedProducts.filter(p => 
        !product.variants.some(variant => variant.id === p.variant.id)));
    } else {
      const newSelections = product.variants.map(variant => ({
        name: product.name,
        variant
      }));
      setSelectedProducts([...selectedProducts, ...newSelections]);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Products</h2>
        <input
          type="text"
          placeholder="Search Products"
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product =>
              product.name.toLowerCase().includes(query)
            );
            setDisplayedProducts(filteredProducts.slice(0, itemsPerPage));
            setPage(2);
          }}
        />
        <div className="product-list" onScroll={handleScroll}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <tr>
                    <td colSpan="4">
                      <input
                        type="checkbox"
                        checked={product.variants.every(variant =>
                          selectedProducts.some(p => p.variant.id === variant.id))}
                        onChange={() => toggleAllVariants(product)}
                      /> {product.name}
                    </td>
                  </tr>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="product-item">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProducts.some(p => p.variant.id === variant.id)}
                          onChange={() => toggleSelection(product, variant)}
                        />
                      </td>
                      <td>{variant.size} / {variant.material}</td>
                      <td>{variant.stock}</td>
                      <td>${variant.price}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {loading && <p>Loading more products...</p>}
        </div>
        <div className="modal-actions">
          <span>{selectedProducts.length} product(s) selected</span>
          <div>
            <button onClick={onClose}>Cancel</button>
            <button onClick={() => onAdd(selectedProducts)}>Add Selected</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
