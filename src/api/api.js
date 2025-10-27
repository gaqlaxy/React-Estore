// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

export const getProducts = (params = {}) => API.get("/products", { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get("/categories");
export const postOrder = (order) => API.post("/orders", order);
export const patchOrder = (id, payload) => API.patch(`/orders/${id}`, payload);
export const getOrdersByUser = (email) =>
  API.get("/orders", { params: { userEmail: email } });

// export default API;

// Get all orders
