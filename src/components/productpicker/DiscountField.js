import React, { useState } from "react";

const DiscountField = ({ discount, onApply }) => {
  const [type, setType] = useState(discount?.type || "flat");
  const [value, setValue] = useState(discount?.value || "");

  const handleApply = () => {
    onApply({ type, value });
  };

  return (
    <div className="discount-fields">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="flat">Flat Off</option>
        <option value="percentage">% Off</option>
      </select>
      <input
        type="number"
        min="1"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleApply}>Apply</button>
    </div>
  );
};

export default DiscountField;
