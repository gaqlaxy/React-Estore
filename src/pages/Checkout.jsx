import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { fetchCart, fetchProductsByIds, placeOrder } from "../api";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const cart = await fetchCart(user.uid);
      setCartItems(cart);
      const productIds = cart.map((i) => i.productId);
      const prods = await fetchProductsByIds(productIds);
      setProducts(prods);

      const q = query(
        collection(db, "addresses"),
        where("userId", "==", user.uid)
      );
      const snap = await getDocs(q);
      setAddresses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }

    loadData();
  }, [user]);

  // ➕ Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, "addresses"), {
      ...newAddress,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });

    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
    setAdding(false);

    const q = query(
      collection(db, "addresses"),
      where("userId", "==", user.uid)
    );
    const snap = await getDocs(q);
    setAddresses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert("Please select an address first!");
    if (!cartItems.length) return alert("Your cart is empty!");

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

      await placeOrder(
        user.uid,
        user.email,
        orderItems,
        `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}`
      );

      setSuccessMsg("✅ Order placed successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

        {/* Address Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Address</h3>
          {addresses.length === 0 && (
            <p className="text-gray-500">No addresses yet. Add one below.</p>
          )}

          <div className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`block border p-3 rounded-lg cursor-pointer transition-all ${
                  selectedAddress?.id === addr.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress?.id === addr.id}
                  onChange={() => setSelectedAddress(addr)}
                  className="mr-3 accent-blue-500"
                />
                <span className="font-medium">{addr.name}</span> — {addr.street}
                , {addr.city}, {addr.state}, {addr.pincode} ({addr.phone})
              </label>
            ))}
          </div>
        </div>

        {/* Add Address Form */}
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="mt-5 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            + Add New Address
          </button>
        )}

        {adding && (
          <form
            onSubmit={handleAddAddress}
            className="mt-5 bg-gray-50 p-4 rounded-md space-y-3"
          >
            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 rounded"
              value={newAddress.name}
              onChange={(e) =>
                setNewAddress({ ...newAddress, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Street"
              className="w-full border p-2 rounded"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              required
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="City"
                className="w-1/2 border p-2 rounded"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="State"
                className="w-1/2 border p-2 rounded"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                required
              />
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Pincode"
                className="w-1/2 border p-2 rounded"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-1/2 border p-2 rounded"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-between mt-3">
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Place Order
        </button>

        {successMsg && (
          <p className="mt-4 text-green-600 font-semibold text-center">
            {successMsg}
          </p>
        )}
      </div>
    </div>
  );
}
