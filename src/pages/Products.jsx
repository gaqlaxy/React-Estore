// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/ProductCard";
// import CategoryFilter from "../components/CategoryFilter";
// import { addToCart, addToWishlist } from "../api";
// import useAuth from "../hooks/useAuth"; // replace with your auth context

// export default function Products() {
//   const { user } = useAuth(); // logged-in user
//   const [products, setProducts] = useState([]);
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     axios.get("http://localhost:5000/products").then((res) => {
//       setProducts(res.data);
//       setDisplayedProducts(res.data);
//     });
//   }, []);

//   useEffect(() => {
//     let filtered = [...products];

//     if (searchTerm.trim()) {
//       filtered = filtered.filter((p) =>
//         p.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (selectedCategory) {
//       filtered = filtered.filter(
//         (p) => p.categoryId === parseInt(selectedCategory)
//       );
//     }

//     if (sortOption === "lowToHigh") filtered.sort((a, b) => a.price - b.price);
//     if (sortOption === "highToLow") filtered.sort((a, b) => b.price - a.price);
//     if (sortOption === "az")
//       filtered.sort((a, b) => a.title.localeCompare(b.title));
//     if (sortOption === "za")
//       filtered.sort((a, b) => b.title.localeCompare(a.title));

//     setDisplayedProducts(filtered);
//   }, [searchTerm, sortOption, selectedCategory, products]);

//   const handleAddToCart = async (product) => {
//     if (!user) return alert("Please login first!");

//     try {
//       await addToCart(user.uid, product);
//       alert(`${product.title} added to cart!`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add to cart.");
//     }
//   };

//   const handleAddToWishlist = async (product) => {
//     if (!user) return alert("Please login first!");

//     try {
//       await addToWishlist(user.uid, product.id);
//       alert(`${product.title} added to wishlist!`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add to wishlist.");
//     }
//   };

//   return (
//     <div className="container" style={{ padding: "2rem" }}>
//       <h2>All Products</h2>

//       <div style={{ marginBottom: "1rem" }}>
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             padding: "0.4rem",
//             marginRight: "0.5rem",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         />

//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           style={{
//             padding: "0.4rem",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         >
//           <option value="">Sort By</option>
//           <option value="lowToHigh">Price: Low to High</option>
//           <option value="highToLow">Price: High to Low</option>
//           <option value="az">A → Z</option>
//           <option value="za">Z → A</option>
//         </select>
//       </div>

//       <CategoryFilter onCategorySelect={setSelectedCategory} />

//       <div
//         className="product-grid"
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//           gap: "1rem",
//         }}
//       >
//         {displayedProducts.map((prod) => (
//           <ProductCard
//             key={prod.id}
//             product={prod}
//             onAddToCart={handleAddToCart}
//             onAddToWishlist={handleAddToWishlist}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { addToCart, addToWishlist, fetchWishlist } from "../api";
import useAuth from "../hooks/useAuth";

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((res) => {
      setProducts(res.data);
      setDisplayedProducts(res.data);
    });
  }, []);

  // Fetch wishlist on user change
  useEffect(() => {
    if (user) {
      fetchWishlist(user.uid).then(setWishlist);
    }
  }, [user]);

  const handleAddToCart = async (product) => {
    if (!user) return alert("Please login first!");
    try {
      await addToCart(user.uid, product);
      alert(`${product.title} added to cart!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!user) return alert("Please login first!");
    try {
      await addToWishlist(user.uid, product.id);
      setWishlist((prev) => [...prev, product.id]); // update local wishlist
      alert(`${product.title} added to wishlist!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add to wishlist.");
    }
  };

  // Filtering and sorting logic remains the same
  useEffect(() => {
    let filtered = [...products];
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.categoryId === parseInt(selectedCategory)
      );
    }
    if (sortOption === "lowToHigh") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "highToLow") filtered.sort((a, b) => b.price - a.price);
    if (sortOption === "az")
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sortOption === "za")
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    setDisplayedProducts(filtered);
  }, [searchTerm, sortOption, selectedCategory, products]);

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>All Products</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.4rem",
            marginRight: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: "0.4rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      <CategoryFilter onCategorySelect={setSelectedCategory} />

      <div
        className="product-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {displayedProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onAddToCart={handleAddToCart}
            // only show wishlist button if product not in wishlist
            onAddToWishlist={
              wishlist.includes(prod.id) ? null : handleAddToWishlist
            }
          />
        ))}
      </div>
    </div>
  );
}
