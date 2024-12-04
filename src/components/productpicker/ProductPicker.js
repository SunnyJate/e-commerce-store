import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GrDrag } from "react-icons/gr"; // Drag icon
import { HiPencil } from "react-icons/hi"; // Pencil icon
import { MdDelete } from "react-icons/md"; // Delete icon for product and variant
import SelectProductModal from "../SelectProductModal"; // Make sure to import the modal
import "./ProductPicker.css";

const ProductPicker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showVariants, setShowVariants] = useState({});
  const [discountInfo, setDiscountInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [currentProductToEdit, setCurrentProductToEdit] = useState(null); // Track the product being edited

  useEffect(() => {
    if (location.state?.checkedProducts) {
      setProducts(location.state.checkedProducts);
      const initialVisibility = {};
      location.state.checkedProducts.forEach((product) => {
        initialVisibility[product.id] = false;
      });
      setShowVariants(initialVisibility);
    } else {
      console.error("No products found in state");
    }
  }, [location.state]);

  const toggleVariants = (productId) => {
    setShowVariants((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleAddDiscount = (productId) => {
    setDiscountInfo((prevState) => ({
      ...prevState,
      [productId]: {
        isDiscountAdded: !prevState[productId]?.isDiscountAdded,
        amount: prevState[productId]?.amount || "",
        type: prevState[productId]?.type || "flat off",
      },
    }));
  };

  const handleDiscountChange = (productId, field, value) => {
    if (field === "amount" && value < 0) {
      value = 0; // Prevent negative discount values
    }
    setDiscountInfo((prevState) => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [field]: value,
      },
    }));
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prevState) =>
      prevState.filter((product) => product.id !== productId)
    );
  };

  const handleDeleteVariant = (productId, variantId) => {
    setProducts((prevState) =>
      prevState
        .map((product) => {
          if (product.id === productId) {
            const updatedVariants = product.selectedVariants.filter(
              (variant) => variant.id !== variantId
            );
            if (updatedVariants.length === 0) {
              return null;
            }
            return {
              ...product,
              selectedVariants: updatedVariants,
            };
          }
          return product;
        })
        .filter(Boolean) // Remove any null (products with no variants)
    );
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setCurrentProductToEdit(null); // Reset the editing state
  };

  const handleAddSelectedProducts = (selectedProducts) => {
    if (currentProductToEdit) {
      // Update the edited product
      setProducts((prevState) =>
        prevState.map((product) =>
          product.id === currentProductToEdit.id ? { ...product, ...selectedProducts[0] } : product
        )
      );
    } else {
      // Add new products
      setProducts((prevState) => [...prevState, ...selectedProducts]);
    }
  };

  const handleEditProduct = (product) => {
    setCurrentProductToEdit(product); // Set the product to be edited
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="product-picker-container">
      {/* Product List */}
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <div className="product-header">
            <span className="drag-icon">
              <GrDrag />
            </span>
            <div className="product-info">
              <div className="product-name-wrapper">
                <div className="product-name-box">
                  <input
                    className="product-name-input"
                    type="text"
                    value={product.title}
                    readOnly
                  />
                  {/* Edit icon */}
                  <span
                    className="edit-icon"
                    onClick={() => handleEditProduct(product)} // Open modal on Pencil icon click
                  >
                    <HiPencil />
                  </span>
                </div>
              </div>
              {discountInfo[product.id]?.isDiscountAdded ? (
                <div className="discount-fields">
                  <input
                    type="number"
                    value={discountInfo[product.id]?.amount}
                    onChange={(e) =>
                      handleDiscountChange(product.id, "amount", e.target.value)
                    }
                  />
                  <select
                    value={discountInfo[product.id]?.type}
                    onChange={(e) =>
                      handleDiscountChange(product.id, "type", e.target.value)
                    }
                  >
                    <option value="flat off">Flat off</option>
                    <option value="% off">% Off</option>
                  </select>
                </div>
              ) : (
                <button
                  className="add-discount-btn"
                  onClick={() => handleAddDiscount(product.id)}
                >
                  Add Discount
                </button>
              )}
              {/* Delete Product Button */}
              <button
                className="delete-product-btn"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <MdDelete />
              </button>
            </div>
          </div>

          {/* Show/Hide Variants Button */}
          <button
            className="toggle-variants-btn"
            onClick={() => toggleVariants(product.id)}
          >
            {showVariants[product.id] ? "Hide Variants ▲" : "Show Variants ▼"}
          </button>

          {showVariants[product.id] && (
            <div className="variants">
              {product.selectedVariants?.map((variant) => (
                <div key={variant.id} className="variant-item">
                  <span className="drag-icon">
                    <GrDrag />
                  </span>
                  <div className="variant-name-box">
                    <input
                      className="variant-name-input"
                      type="text"
                      value={variant.title}
                      readOnly
                    />
                  </div>
                  {/* Delete Variant Button */}
                  <button
                    className="delete-variant-btn"
                    onClick={() => handleDeleteVariant(product.id, variant.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add Product Button */}
      {!isModalOpen && (
        <button className="add-product-btn" onClick={openModal}>
          + Add Product
        </button>
      )}

      {/* Conditional Rendering of Modal */}
      {isModalOpen && (
        <SelectProductModal
          onClose={closeModal}
          onAdd={handleAddSelectedProducts} // Pass the method to handle the selected products
          preSelectedProducts={products} // Pass the already selected products
        />
      )}
    </div>
  );
};

export default ProductPicker;
