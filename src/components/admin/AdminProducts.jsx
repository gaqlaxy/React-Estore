import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000/products"; // change if your json-server port differs

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
    };

    if (editProduct) {
      await axios.put(`${API_URL}/${editProduct.id}`, productData);
    } else {
      await axios.post(API_URL, productData);
    }

    setShowModal(false);
    setEditProduct(null);
    setForm({
      title: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      image: "",
    });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading products...</p>
    );

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Manage Products</h2>
        <button
          onClick={() => {
            setEditProduct(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  <img
                    src={p.image || "https://via.placeholder.com/80"}
                    alt={p.title}
                    className="w-16 h-16 object-cover mx-auto rounded-md"
                  />
                </td>
                <td className="p-3 border">{p.title}</td>
                <td className="p-3 border">₹{p.price}</td>
                <td className="p-3 border">{p.stock}</td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {/* <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-96 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">
                {editProduct ? "Edit Product" : "Add Product"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  "title",
                  "description",
                  "price",
                  "stock",
                  "categoryId",
                  "image",
                ].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required={field !== "image"}
                  />
                ))}

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {editProduct ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-xl p-6 w-[420px] shadow-xl relative"
            >
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>

              {/* Image Preview */}
              {form.image && (
                <div className="mb-4 text-center">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-24 h-24 mx-auto object-cover rounded-lg border"
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
                {/* Title */}
                <input
                  type="text"
                  placeholder="Product Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="border px-3 py-2 rounded focus:outline-blue-500"
                  required
                />

                {/* Description */}
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="border px-3 py-2 rounded h-20 resize-none focus:outline-blue-500"
                  required
                />

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="border px-3 py-2 rounded focus:outline-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="border px-3 py-2 rounded focus:outline-blue-500"
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="border px-3 py-2 rounded focus:outline-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="1">Electronics</option>
                  <option value="2">Accessories</option>
                  <option value="3">Home</option>
                  <option value="4">Clothing</option>
                  <option value="5">Books</option>
                </select>

                {/* Image URL */}
                <input
                  type="url"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="border px-3 py-2 rounded focus:outline-blue-500"
                />

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
