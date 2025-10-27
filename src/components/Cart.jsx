import React, { useState, useEffect } from "react";
import {
  fetchCart,
  fetchProductsByIds,
  removeFromCart,
  updateCartItem,
  placeOrder,
} from "../api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

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

  const refreshCart = async () => {
    if (!user) return;
    const items = await fetchCart(user.uid);
    setCartItems(items);
  };

  // const handleCheckout = async () => {
  //   if (!user) return alert("Please login first!");
  //   if (!cartItems.length) return alert("Cart is empty!");
  //   try {
  //     await placeOrder(user.uid, user.email, cartItems, "Home address");
  //     alert("Order placed successfully!");
  //     setCartItems([]);
  //     setProducts([]);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to place order");
  //   }
  // };

  const handleCheckout = async () => {
    if (!user) return alert("Please login first!");
    if (!cartItems.length) return alert("Cart is empty!");

    try {
      const orderItems = cartItems.map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          qty: item.qty,
          title: prod?.title || "Unknown",
          price: prod?.price || 0,
        };
      });

      await placeOrder(user.uid, user.email, orderItems, "Home address");
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

  if (!cartItems.length)
    return (
      <p className="text-center text-gray-500 mt-10">Your cart is empty 🛒</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <ul className="space-y-4">
        {cartItems.map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          return (
            <li
              key={item.productId}
              className="flex items-center gap-4 border p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={prod?.image}
                alt={prod?.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{prod?.title}</h4>
                <p className="text-gray-600">₹{prod?.price} each</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQtyChange(item.productId, item.qty - 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-medium">{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.productId, item.qty + 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <p className="font-bold text-lg">₹{item.qty * prod?.price}</p>
              <button
                onClick={() => handleRemove(item.productId)}
                className="text-red-500 hover:underline ml-4"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 text-right">
        <h4 className="text-xl font-semibold mb-2">
          Total: ₹{calculateTotal()}
        </h4>
        {/* <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Checkout
        </button> */}
        <button
          onClick={() => navigate("/checkout")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
