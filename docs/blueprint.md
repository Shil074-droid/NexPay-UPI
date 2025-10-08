# **App Name**: NexPay UPI

## Core Features:

- User Authentication: Secure user authentication using Firebase Auth with email and password, including role selection (customer/merchant/admin) during signup.
- Proximity Connection Simulation: Simulate proximity-based connection between customer and merchant using a modal to select from available merchants.
- Transaction Simulation: Simulate transactions by allowing customers to enter an amount and send it to a selected merchant. Includes Firestore updates and success notifications.
- Dashboard Views: Role-based dashboards (customer, merchant, admin) displaying relevant information such as balances, recent transactions, and incoming payment requests.
- Instant Settlement Simulation: Simulate instant settlement by immediately updating the merchant's balance upon receiving a payment and displaying a visual confirmation.
- Transaction History: Display a transaction history table with details such as date, counterparty, amount, status, settlement mode and a mock CSV export feature.
- Admin Dashboard: Show an admin-only page with charts for daily transaction count, merchant vs. customer ratio, and instant vs. pending settlements. The admin user is denoted in the database.

## Style Guidelines:

- Primary color: Gradient blue-violet (#3b82f6 to #9333ea) to evoke trust and innovation.
- Background color: White (#FFFFFF) for a clean and modern interface.
- Accent color: A slightly brighter shade of blue (#60a5fa) used in buttons and other interactive elements to draw the user's eye.
- Body and headline font: 'Inter' (sans-serif) for a modern, clean, and readable experience. Note: currently only Google Fonts are supported.
- Use modern, minimalist icons generated specifically for the app and not defaults to represent various actions and categories.
- Use a responsive layout optimized for both desktop and mobile devices, with a clean and intuitive user interface.
- Implement subtle animations and transitions using Framer Motion to provide feedback and enhance the user experience.