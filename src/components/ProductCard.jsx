import React from "react";

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const { title, price, stock, image } = product;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <img
        src={image || "https://via.placeholder.com/200"}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="font-bold mb-2">₹{price}</p>

        <div className="flex flex-col gap-2">
          <button
            disabled={stock === 0}
            onClick={() => onAddToCart?.(product)}
            className={`rounded-md px-4 py-2 text-white font-semibold transition-colors duration-300 ${
              stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {onAddToWishlist && (
            <button
              onClick={() => onAddToWishlist(product)}
              className={`rounded-md px-4 py-2 text-white font-semibold transition-colors duration-300 ${
                stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Add to Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
