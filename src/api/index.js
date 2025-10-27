// Add product to cart
const BASE_URL = "http://localhost:5000"; // your json-server URL

export async function addToCart(userId, product) {
  const res = await fetch(`${BASE_URL}/carts?userId=${userId}`);
  const cartData = await res.json();
  let updatedCart;

  if (cartData.length === 0) {
    // create cart
    const newCart = { userId, items: [{ productId: product.id, qty: 1 }] };
    await fetch(`${BASE_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCart),
    });
    return;
  } else {
    // update existing cart
    const cart = cartData[0];
    const existingItem = cart.items.find((i) => i.productId === product.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.items.push({ productId: product.id, qty: 1 });
    }

    await fetch(`${BASE_URL}/carts/${cart.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cart),
    });
  }
}

// Add product to wishlist
export async function addToWishlist(userId, productId) {
  const res = await fetch(`${BASE_URL}/wishlists?userId=${userId}`);
  const data = await res.json();

  if (data.length === 0) {
    const newWishlist = { userId, productIds: [productId] };
    await fetch(`${BASE_URL}/wishlists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWishlist),
    });
  } else {
    const wishlist = data[0];
    if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
      await fetch(`${BASE_URL}/wishlists/${wishlist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wishlist),
      });
    }
  }
}

export async function fetchWishlist(userId) {
  const res = await fetch(`${BASE_URL}/wishlists?userId=${userId}`);
  const data = await res.json();
  return data[0]?.productIds || [];
}

export async function fetchCart(userId) {
  const res = await fetch(`${BASE_URL}/carts?userId=${userId}`);
  const data = await res.json();
  return data[0]?.items || [];
}

export async function fetchOrders(userEmail) {
  const res = await fetch(`${BASE_URL}/orders?userEmail=${userEmail}`);
  const data = await res.json();
  return data;
}

export async function fetchProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const queries = ids.map((id) => `id=${id}`).join("&");
  const res = await fetch(`${BASE_URL}/products?${queries}`);
  return await res.json();
}

export async function placeOrder(userId, userEmail, cartItems, address) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail,
      items: cartItems,
      address,
      status: "On Process",
      createdAt: new Date().toISOString(),
    }),
  });

  if (!res.ok) throw new Error("Failed to create order");

  // Clear the cart
  const cartRes = await fetch(`${BASE_URL}/carts?userId=${userId}`);
  const carts = await cartRes.json();
  if (carts.length) {
    await fetch(`${BASE_URL}/carts/${carts[0].id}`, { method: "DELETE" });
  }

  return await res.json();
}

// Remove an item from cart
export async function removeFromCart(userId, productId) {
  const res = await fetch(`${BASE_URL}/carts?userId=${userId}`);
  const carts = await res.json();
  if (!carts.length) return;

  const cart = carts[0];
  cart.items = cart.items.filter((i) => i.productId !== productId);

  await fetch(`${BASE_URL}/carts/${cart.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });
}

// Update cart item quantity
export async function updateCartItem(userId, productId, qty) {
  const res = await fetch(`${BASE_URL}/carts?userId=${userId}`);
  const carts = await res.json();
  if (!carts.length) return;

  const cart = carts[0];
  const item = cart.items.find((i) => i.productId === productId);
  if (!item) return;

  item.qty = qty;
  if (item.qty <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
  }

  await fetch(`${BASE_URL}/carts/${cart.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });
}

export async function removeFromWishlist(userId, productId) {
  const res = await fetch(`${BASE_URL}/wishlists?userId=${userId}`);
  const data = await res.json();
  if (!data.length) return;

  const wishlist = data[0];
  wishlist.productIds = wishlist.productIds.filter((id) => id !== productId);

  await fetch(`${BASE_URL}/wishlists/${wishlist.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wishlist),
  });
}

export async function fetchAllOrders() {
  const res = await fetch("http://localhost:5000/orders");
  return res.json();
}

// Update order status
export async function updateOrderStatus(orderId, newStatus) {
  const res = await fetch(`http://localhost:5000/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  return res.json();
}

// Delete an order
export async function deleteOrder(orderId) {
  await fetch(`http://localhost:5000/orders/${orderId}`, { method: "DELETE" });
}

export async function fetchAddresses(userId) {
  const res = await fetch(`http://localhost:5000/addresses?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return await res.json();
}

export async function addAddress(userId, addressData) {
  const payload = { ...addressData, userId };
  const res = await fetch("http://localhost:5000/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add address");
  return await res.json();
}

export async function clearCart(userId) {
  const res = await fetch(`http://localhost:5000/cart?userId=${userId}`);
  const cartItems = await res.json();

  for (const item of cartItems) {
    await fetch(`http://localhost:5000/cart/${item.id}`, { method: "DELETE" });
  }
}
