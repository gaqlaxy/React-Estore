// // DashboardCart.jsx
// import React, { useState, useEffect } from "react";
// import { fetchCart, fetchProductsByIds, addToCart } from "../api";
// import useAuth from "../hooks/useAuth";
// import { placeOrder } from "../api";

// export default function Cart() {
//   const { user } = useAuth();
//   const [cartItems, setCartItems] = useState([]);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function loadCart() {
//       if (!user) return;

//       const items = await fetchCart(user.uid);
//       setCartItems(items);

//       const productIds = items.map((i) => i.productId);
//       const prods = await fetchProductsByIds(productIds);
//       setProducts(prods);
//     }
//     loadCart();
//   }, [user]);

//   const handleCheckout = async () => {
//     if (!user) return alert("Please login first!");

//     try {
//       await placeOrder(user.uid, user.email, cartItems, "Home address");
//       alert("Order placed successfully!");
//       setCartItems([]); // clear UI cart
//     } catch (err) {
//       console.error(err);
//       alert("Failed to place order");
//     }
//   };

//   return (
//     <div>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <>
//           <ul>
//             {cartItems.map((item) => {
//               const prod = products.find((p) => p.id === item.productId);
//               return (
//                 <li key={item.productId}>
//                   {prod?.title} x {item.qty} — ₹{item.qty * prod?.price}
//                 </li>
//               );
//             })}
//           </ul>
//           <button onClick={handleCheckout}>Checkout</button>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  fetchCart,
  fetchProductsByIds,
  addToCart,
  removeFromCart,
  updateCartItem,
  placeOrder,
} from "../api";
import useAuth from "../hooks/useAuth";

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  // Load cart
  useEffect(() => {
    async function loadCart() {
      if (!user) return;

      const items = await fetchCart(user.uid);
      setCartItems(items);

      const productIds = items.map((i) => i.productId);
      const prods = await fetchProductsByIds(productIds);
      setProducts(prods);
    }
    loadCart();
  }, [user]);

  // Update cart locally after API change
  const refreshCart = async () => {
    if (!user) return;
    const items = await fetchCart(user.uid);
    setCartItems(items);
  };

  const handleCheckout = async () => {
    if (!user) return alert("Please login first!");
    if (!cartItems.length) return alert("Cart is empty!");

    try {
      await placeOrder(user.uid, user.email, cartItems, "Home address");
      alert("Order placed successfully!");
      setCartItems([]);
      setProducts([]);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(user.uid, productId);
    refreshCart();
  };

  const handleQtyChange = async (productId, qty) => {
    if (qty < 1) return;
    await updateCartItem(user.uid, productId, qty);
    refreshCart();
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.productId);
      return sum + (prod?.price || 0) * item.qty;
    }, 0);
  };

  if (!cartItems.length) return <p>Your cart is empty</p>;

  return (
    <div>
      {/* <ul>
        {cartItems.map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          if (!prod) return null;

          return (
            <li key={item.productId} style={{ marginBottom: "1rem" }}>
              <strong>{prod.title}</strong> — ₹{prod.price} x {item.qty} = ₹
              {prod.price * item.qty}
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => handleQtyChange(item.productId, item.qty - 1)}
                >
                  -
                </button>
                <span style={{ margin: "0 0.5rem" }}>{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.productId, item.qty + 1)}
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.productId)}
                  style={{ marginLeft: "1rem", color: "red" }}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul> */}

      {/* <ul>
        {cartItems.map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          if (!prod) return null;

          return (
            <li
              key={item.productId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <img
                src={prod.image}
                alt={prod.title}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <div>
                <strong>{prod.title}</strong> — ₹{prod.price} x {item.qty} = ₹
                {prod.price * item.qty}
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={() =>
                      handleQtyChange(item.productId, item.qty - 1)
                    }
                  >
                    -
                  </button>
                  <span style={{ margin: "0 0.5rem" }}>{item.qty}</span>
                  <button
                    onClick={() =>
                      handleQtyChange(item.productId, item.qty + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    style={{ marginLeft: "1rem", color: "red" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul> */}

      <ul className="space-y-4">
        {cartItems.map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          return (
            <li
              key={item.productId}
              className="flex items-center gap-4 border p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={prod?.image}
                alt={prod?.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{prod?.title}</h4>
                <p>Qty: {item.qty}</p>
              </div>
              <p className="font-bold">₹{item.qty * prod?.price}</p>

              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => handleQtyChange(item.productId, item.qty - 1)}
                >
                  -
                </button>
                <span style={{ margin: "0 0.5rem" }}>{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.productId, item.qty + 1)}
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.productId)}
                  style={{ marginLeft: "1rem", color: "red" }}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <h4>Total: ₹{calculateTotal()}</h4>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}
