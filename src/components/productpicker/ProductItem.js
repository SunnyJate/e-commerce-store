import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { GrDrag } from "react-icons/gr";
import VariantList from "./VariantList";
import DiscountField from "./DiscountField";

const ProductItem = ({ product, index, onRemove, onUpdate }) => {
  const toggleVariantsVisibility = () => {
    onUpdate({ ...product, showVariants: !product.showVariants });
  };

  const handleDiscountUpdate = (discount) => {
    onUpdate({ ...product, discount });
  };

  const handleVariantsUpdate = (updatedVariants) => {
    onUpdate({ ...product, variants: updatedVariants });
  };

  return (
    <Draggable draggableId={product.id} index={index}>
      {(provided) => (
        <div className="product-item" ref={provided.innerRef} {...provided.draggableProps}>
          <div className="product-header">
            <GrDrag {...provided.dragHandleProps} />
            <input type="text" value={product.title} className="product-title-input" readOnly />
            <button onClick={() => onRemove(product.id)}>❌</button>
          </div>
          <button className="variant-toggle" onClick={toggleVariantsVisibility}>
            {product.showVariants ? "Hide Variants ▲" : "Show Variants ▼"}
          </button>
          {product.showVariants && (
            <VariantList
              productId={product.id}
              variants={product.variants}
              onUpdate={handleVariantsUpdate}
            />
          )}
          <DiscountField
            discount={product.discount}
            onApply={(discount) => handleDiscountUpdate(discount)}
          />
        </div>
      )}
    </Draggable>
  );
};

export default ProductItem;
