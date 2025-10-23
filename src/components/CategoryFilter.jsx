import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryFilter({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="category" style={{ marginRight: "0.5rem" }}>
        Filter by Category:
      </label>
      <select
        id="category"
        onChange={(e) => onCategorySelect(e.target.value)}
        style={{
          padding: "0.4rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
