// import React, { useEffect, useState } from "react";
// import useAuth from "../hooks/useAuth";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const { user } = useAuth();
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     street: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//   });
//   const [adding, setAdding] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const navigate = useNavigate();

//   const API = "http://localhost:5000";

//   // Fetch addresses + cart
//   useEffect(() => {
//     if (!user?.email) return;
//     const userId = user.email.replace(/[@.]/g, "_");

//     axios.get(`${API}/addresses?userId=${userId}`).then((res) => {
//       setAddresses(res.data);
//     });

//     axios.get(`${API}/carts?userId=${userId}`).then((res) => {
//       if (res.data.length) setCart(res.data[0].items || []);
//     });
//   }, [user]);

//   const handleAddAddress = async (e) => {
//     e.preventDefault();
//     const userId = user.email.replace(/[@.]/g, "_");

//     await axios.post(`${API}/addresses`, { ...newAddress, userId });
//     setNewAddress({
//       name: "",
//       street: "",
//       city: "",
//       state: "",
//       pincode: "",
//       phone: "",
//     });
//     setAdding(false);

//     const res = await axios.get(`${API}/addresses?userId=${userId}`);
//     setAddresses(res.data);
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) return alert("Select an address first!");
//     if (!cart.length) return alert("Your cart is empty.");

//     const userId = user.email.replace(/[@.]/g, "_");
//     const orderData = {
//       userEmail: user.email,
//       items: cart,
//       address: `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}`,
//       status: "Processing",
//       createdAt: new Date().toISOString(),
//     };

//     await axios.post(`${API}/orders`, orderData);
//     await axios.patch(`${API}/carts/${userId}`, { items: [] });

//     setSuccessMsg("✅ Order placed successfully!");
//     setTimeout(() => navigate("/dashboard"), 1500);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
//       <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg">
//         <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

//         {/* Address Section */}
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Select Address</h3>
//           {addresses.length === 0 && (
//             <p className="text-gray-500">No addresses yet. Add one below.</p>
//           )}

//           <div className="space-y-3">
//             {addresses.map((addr) => (
//               <label
//                 key={addr.id}
//                 className={`block border p-3 rounded-lg cursor-pointer transition-all ${
//                   selectedAddress?.id === addr.id
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-300"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="address"
//                   checked={selectedAddress?.id === addr.id}
//                   onChange={() => setSelectedAddress(addr)}
//                   className="mr-3 accent-blue-500"
//                 />
//                 <span className="font-medium">{addr.name}</span> — {addr.street}
//                 , {addr.city}, {addr.state}, {addr.pincode} ({addr.phone})
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Add Address Form */}
//         {!adding && (
//           <button
//             onClick={() => setAdding(true)}
//             className="mt-5 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
//           >
//             + Add New Address
//           </button>
//         )}

//         {adding && (
//           <form
//             onSubmit={handleAddAddress}
//             className="mt-5 bg-gray-50 p-4 rounded-md space-y-3"
//           >
//             <input
//               type="text"
//               placeholder="Name"
//               className="w-full border p-2 rounded"
//               value={newAddress.name}
//               onChange={(e) =>
//                 setNewAddress({ ...newAddress, name: e.target.value })
//               }
//               required
//             />
//             <input
//               type="text"
//               placeholder="Street"
//               className="w-full border p-2 rounded"
//               value={newAddress.street}
//               onChange={(e) =>
//                 setNewAddress({ ...newAddress, street: e.target.value })
//               }
//               required
//             />
//             <div className="flex gap-3">
//               <input
//                 type="text"
//                 placeholder="City"
//                 className="w-1/2 border p-2 rounded"
//                 value={newAddress.city}
//                 onChange={(e) =>
//                   setNewAddress({ ...newAddress, city: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="State"
//                 className="w-1/2 border p-2 rounded"
//                 value={newAddress.state}
//                 onChange={(e) =>
//                   setNewAddress({ ...newAddress, state: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div className="flex gap-3">
//               <input
//                 type="text"
//                 placeholder="Pincode"
//                 className="w-1/2 border p-2 rounded"
//                 value={newAddress.pincode}
//                 onChange={(e) =>
//                   setNewAddress({ ...newAddress, pincode: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Phone"
//                 className="w-1/2 border p-2 rounded"
//                 value={newAddress.phone}
//                 onChange={(e) =>
//                   setNewAddress({ ...newAddress, phone: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div className="flex justify-between mt-3">
//               <button
//                 type="button"
//                 onClick={() => setAdding(false)}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Save Address
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Place Order */}
//         <button
//           onClick={handlePlaceOrder}
//           className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
//         >
//           Place Order
//         </button>

//         {successMsg && (
//           <p className="mt-4 text-green-600 font-semibold text-center">
//             {successMsg}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Checkout;

// import React, { useEffect, useState } from "react";
// import { placeOrder, fetchCart, fetchProductsByIds } from "../api";
// import useAuth from "../hooks/useAuth";
// import { useNavigate } from "react-router-dom";

// export default function Checkout() {
//   const { user } = useAuth();
//   const [cartItems, setCartItems] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [newAddress, setNewAddress] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function load() {
//       if (!user) return;

//       const items = await fetchCart(user.uid);
//       setCartItems(items);
//       const productIds = items.map((i) => i.productId);
//       const prods = await fetchProductsByIds(productIds);
//       setProducts(prods);

//       // Get user addresses from db.json (or attach inside user)
//       const res = await fetch(
//         `http://localhost:5000/addresses?userId=${user.uid}`
//       );
//       const data = await res.json();
//       setAddresses(data);
//     }
//     load();
//   }, [user]);

//   const handleAddAddress = async () => {
//     if (!newAddress.trim()) return;
//     const body = { userId: user.uid, address: newAddress };
//     await fetch(`http://localhost:5000/addresses`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     setNewAddress("");
//     const res = await fetch(
//       `http://localhost:5000/addresses?userId=${user.uid}`
//     );
//     setAddresses(await res.json());
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) return alert("Please select an address!");
//     const orderItems = cartItems.map((item) => {
//       const prod = products.find((p) => p.id === item.productId);
//       return {
//         productId: item.productId,
//         qty: item.qty,
//         title: prod?.title || "Unknown",
//         price: prod?.price || 0,
//       };
//     });

//     await placeOrder(user.uid, user.email, orderItems, selectedAddress);
//     alert("Order placed successfully!");
//     navigate("/dashboard");
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Checkout</h2>

//       <h3 className="font-semibold mb-2">Select Delivery Address</h3>
//       {addresses.length === 0 && (
//         <p className="text-gray-500 mb-3">No saved addresses yet.</p>
//       )}

//       <div className="space-y-3 mb-4">
//         {addresses.map((addr) => (
//           <label
//             key={addr.id}
//             className={`block border p-3 rounded-lg cursor-pointer ${
//               selectedAddress === addr.address
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300"
//             }`}
//           >
//             <input
//               type="radio"
//               name="address"
//               checked={selectedAddress === addr.address}
//               onChange={() => setSelectedAddress(addr.address)}
//               className="mr-2"
//             />
//             {addr.address}
//           </label>
//         ))}
//       </div>

//       <div className="mb-5">
//         <input
//           type="text"
//           placeholder="Add new address..."
//           className="border p-2 rounded w-full mb-2"
//           value={newAddress}
//           onChange={(e) => setNewAddress(e.target.value)}
//         />
//         <button
//           onClick={handleAddAddress}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           + Add Address
//         </button>
//       </div>

//       <button
//         onClick={handlePlaceOrder}
//         className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }

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

  // Fetch cart + products + addresses
  useEffect(() => {
    async function loadData() {
      if (!user) return;

      // 🛒 Load cart
      const cart = await fetchCart(user.uid);
      setCartItems(cart);
      const productIds = cart.map((i) => i.productId);
      const prods = await fetchProductsByIds(productIds);
      setProducts(prods);

      // 🏠 Load addresses
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

  // 🧾 Place Order
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
