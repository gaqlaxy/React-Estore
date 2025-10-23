// import React from "react";

// export default function ProductCard({ product }) {
//   const { title, description, price, stock, image } = product;

//   return (
//     <div
//       style={{
//         border: "1px solid #ccc",
//         padding: "1rem",
//         borderRadius: "8px",
//         backgroundColor: "#fff",
//       }}
//     >
//       <img
//         src={image || "https://via.placeholder.com/200"}
//         alt={title}
//         style={{
//           width: "100%",
//           height: "200px",
//           objectFit: "cover",
//           borderRadius: "6px",
//         }}
//       />
//       <h3 style={{ margin: "0.5rem 0" }}>{title}</h3>
//       <p>{description}</p>
//       <p style={{ fontWeight: "bold" }}>₹{price}</p>
//       <button
//         disabled={stock === 0}
//         style={{
//           background: stock === 0 ? "#ccc" : "#007bff",
//           color: "#fff",
//           border: "none",
//           padding: "0.5rem 1rem",
//           borderRadius: "4px",
//           cursor: stock === 0 ? "not-allowed" : "pointer",
//         }}
//       >
//         {stock === 0 ? "Out of Stock" : "Add to Cart"}
//       </button>
//     </div>
//   );
// }

import React from "react";

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const { title, description, price, stock, image } = product;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={image || "https://via.placeholder.com/200"}
        alt={title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />
      <h3 style={{ margin: "0.5rem 0" }}>{title}</h3>
      <p>{description}</p>
      <p style={{ fontWeight: "bold" }}>₹{price}</p>

      <button
        disabled={stock === 0}
        onClick={() => onAddToCart?.(product)}
        style={{
          background: stock === 0 ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          cursor: stock === 0 ? "not-allowed" : "pointer",
          marginBottom: "0.5rem",
        }}
      >
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>

      {onAddToWishlist && (
        <button
          disabled={stock === 0}
          onClick={() => onAddToWishlist(product)}
          style={{
            background: stock === 0 ? "#ccc" : "#ff9800",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: stock === 0 ? "not-allowed" : "pointer",
          }}
        >
          Add to Wishlist
        </button>
      )}
    </div>
  );
}
