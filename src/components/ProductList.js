import React, { useState } from "react";
import ProductModal from "./ProductModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import '../styles/ProductList.css';
import { FaPencilAlt } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showVariants, setShowVariants] = useState({});
  const [discounts, setDiscounts] = useState({});

  const toggleShowVariants = (index) => {
    setShowVariants({ ...showVariants, [index]: !showVariants[index] });
  };

  const handleDiscountChange = (index, variantId, field, value) => {
    const updatedDiscounts = { ...discounts };
    if (!updatedDiscounts[index]) {
      updatedDiscounts[index] = {};
    }
    if (!updatedDiscounts[index][variantId]) {
      updatedDiscounts[index][variantId] = {};
    }
    updatedDiscounts[index][variantId][field] = value;
    setDiscounts(updatedDiscounts);
  };

  const handleRemoveDiscount = (index, variantId) => {
    const updatedDiscounts = { ...discounts };
    delete updatedDiscounts[index][variantId];
    if (Object.keys(updatedDiscounts[index]).length === 0) {
      delete updatedDiscounts[index];
    }
    setDiscounts(updatedDiscounts);
  };

  const addProduct = (selectedProducts) => {
    const updatedProducts = [...products];
    if (editIndex !== null) {
      updatedProducts.splice(editIndex, 1, ...selectedProducts);
      setEditIndex(null);
    } else {
      updatedProducts.push(...selectedProducts);
    }
    setProducts(updatedProducts);
    setModalOpen(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProducts(items.map((item, index) => ({ ...item, id: index + 1 })));
  };

  return (
    <div className="product-list">
      <h1>Manage Products</h1>
      <div className="product-row">
        <FaPencilAlt className="edit-icon" onClick={() => setModalOpen(true)} />
        <input type="text" placeholder="Select Product" readOnly />
        <button onClick={() => alert("Adding discount to new product")}>Add Discount</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {products.map((product, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index}>
                  {(provided) => (
                    <div
                      className="product-row"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <HiDotsVertical className="drag-handle" {...provided.dragHandleProps} />
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={product.name}
                        readOnly
                      />
                      <FaPencilAlt className="edit-icon" onClick={() => { setEditIndex(index); setModalOpen(true); }} />
                      <button onClick={() => alert(`Adding discount to ${product.name}`)}>Add Discount</button>
                      <button className="show-variants-button" onClick={() => toggleShowVariants(index)}>
                        {showVariants[index] ? "Hide Variants" : "Show Variants"} ▼
                      </button>
                      {showVariants[index] && (
                        <div className="variants-list">
                          {product.variants.map((variant) => (
                            <div key={variant.id} className="variant-item">
                              <span>{variant.size} / {variant.material}</span>
                              <span>{variant.stock} in stock</span>
                              <span>${variant.price}</span>
                              {discounts[index] && discounts[index][variant.id] ? (
                                <>
                                  <input
                                    type="text"
                                    placeholder="Discount"
                                    value={discounts[index][variant.id].value}
                                    onChange={(e) => handleDiscountChange(index, variant.id, 'value', e.target.value)}
                                  />
                                  <select
                                    value={discounts[index][variant.id].type}
                                    onChange={(e) => handleDiscountChange(index, variant.id, 'type', e.target.value)}
                                  >
                                    <option value="flat">Flat Off</option>
                                    <option value="percent">% Off</option>
                                  </select>
                                  <button onClick={() => handleRemoveDiscount(index, variant.id)}>X</button>
                                </>
                              ) : (
                                <button onClick={() => handleDiscountChange(index, variant.id, 'type', 'flat')}>
                                  Add Discount
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button className="add-product-button" onClick={() => setModalOpen(true)}>Add Product</button>
      {isModalOpen && <ProductModal onClose={() => setModalOpen(false)} onAdd={addProduct} />}
    </div>
  );
}

export default ProductList;
