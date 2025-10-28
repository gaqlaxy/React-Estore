Tech Stack:
React.js • Firebase (Auth + Firestore) • JSON Server • Tailwind CSS

This web app built with React + Firebase, designed to demonstrate a production-ready architecture for handling products, carts, wishlists, orders, and admin operations.

Features:

Customer Side:
-> User Authentication — Firebase Email/Password login & signup
-> Product Listing — Dynamic categories and filtering
-> Wishlist & Cart — Add/remove products with instant updates
-> Quantity Management — Update item count in cart in real time
-> Fake Checkout Page — [Add new addresses, Place fake orders with confirmation]
-> Order History Dashboard — Displays all user orders with statuses
-> Responsive UI

Admin Panel:
-> Role Based Access (Admins only)
->Manage Products — Create, edit, delete items
-> Order Management — View all orders and update statuses
-> Secure Routing — Admin routes protected via user role validation

Project Structure:

src/
├── api/ # API functions for Firebase + JSON Server
├── components/ # Reusable React components
├── hooks/ # Custom hooks (useAuth, etc.)
├── pages/ # Page-level components (Home, Cart, Checkout, Dashboard, Admin)
├── utils/ # Helper functions
└── firebaseConfig.js # Firebase setup

Authentication & Roles:
-> Users authenticate via Firebase Auth
-> Each user record has a role ("user" or "admin")

Database Setup:

Firebase -> Users / Addresses / Orders
JSON Server -> Products / Categories

Run Backend via -> npx json-server --watch db.json --port 5000

Workflow:

-> User Logs in
-> Add any product to wishlist or cart
-> From cart you can select checkout option and it navigates to checkout page.
-> Select / add a shipping address
-> Confirm order
-> Order visible under nav Orders (/admin/orders)

Note:
If you’d like to test the app with my Firebase instance, feel free to contact me — I can share the .env file.
