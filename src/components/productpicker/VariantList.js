import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const VariantList = ({ productId, variants, onUpdate }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedVariants = Array.from(variants);
    const [movedVariant] = reorderedVariants.splice(result.source.index, 1);
    reorderedVariants.splice(result.destination.index, 0, movedVariant);
    onUpdate(reorderedVariants);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`variants-${productId}`} type="variant">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="variant-list">
            {variants.map((variant, index) => (
              <Draggable key={variant.id} draggableId={variant.id} index={index}>
                {(provided) => (
                  <div
                    className="variant-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {variant.title}
                    <button onClick={() => onUpdate(variants.filter(v => v.id !== variant.id))}>
                      ❌
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
  );
};

export default VariantList;
