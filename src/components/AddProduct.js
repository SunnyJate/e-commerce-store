import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GrDrag } from "react-icons/gr";
import { FiEdit2 } from "react-icons/fi"; // React icon for the pencil
import SelectProductModal from "./SelectProductModal";
import "./AddProduct.css";

const AddProduct = () => {
  const [products, setProducts] = useState([{ id: "1", name: "" }]); // Default product with empty name
  const [showModal, setShowModal] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedProducts = Array.from(products);
    const [movedItem] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, movedItem);

    setProducts(reorderedProducts);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddDiscount = (index) => {
    if (!products[index].name.trim()) {
      alert("Please add a product before applying a discount!");
      return;
    }

    // Handle discount logic here
    alert(`Discount added for ${products[index].name}`);
  };

  return (
    <div className="add-product-container">
      <h2>Add Products</h2>
      <div className="labels">
        <span className="product-label">Product</span>
        <span className="discount-label">Discount</span>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-products">
          {(provided) => (
            <div
              className="product-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {products.map((product, index) => (
                <Draggable
                  key={product.id}
                  draggableId={product.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="product-row"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <GrDrag className="drag-icon" />
                      <div className="product-id">{index + 1}.</div>
                      <div className="product-input-wrapper">
                        <input
                          type="text"
                          value={product.name}
                          className="product-input"
                          placeholder="Select Product" // Added placeholder
                          onChange={(e) => {
                            const updatedProducts = [...products];
                            updatedProducts[index].name = e.target.value;
                            setProducts(updatedProducts);
                          }}
                        />
                        <FiEdit2
                          className="edit-icon"
                          onClick={openModal}
                        />
                      </div>
                      <button
                        className="discount-btn"
                        onClick={() => handleAddDiscount(index)}
                      >
                        Add Discount
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Product Button - Conditional Rendering */}
      {!showModal && (
        <div className="add-product-btn-container">
          <button className="add-product-btn" onClick={openModal}>
            Add Product
          </button>
        </div>
      )}

      {showModal && <SelectProductModal onClose={closeModal} />}
    </div>
  );
};

export default AddProduct;
