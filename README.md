# Nextgen Food Court Web Application

A mobile-first food court ordering system for **Nextgen Mall**, Nairobi, digitizing food ordering and table booking across 20–30 cultural cuisine outlets under one unified platform.

## Introduction

A food court is an area within a shopping mall that offers a wide range of food options from different outlets. At **Nextgen Mall**, the current manual approach causes confusion, where multiple waiters approach customers simultaneously with menus.

**This application solves that problem** by allowing customers to view all available menus, place orders, and book tables in advance—directly from their smartphones.

---

## Problem Statement

Nextgen Mall’s food court is busy and culturally diverse, but the manual ordering system is inefficient and confusing. The goal is to digitize the customer experience, improve order management for outlets, and reduce crowding and order errors.

---

## Minimum Viable Product (MVP)

###  Customer Features

- View available food items with price, outlet, and cuisine
- Filter menu by:
  - Cuisine (e.g., Ethiopian, Congolese, Kenyan)
  - Price (lowest/highest)
  - Category (e.g., kids, snacks, mains)
- Add items to cart and view order summary
- Place an order with quantity selection
- Book a table in advance (20–30 minutes before arrival)
- Get notified when order is confirmed and served time is estimated

###  Outlet Owner Dashboard

- Register and manage outlet profile
- Add, update, or delete menu items
- View incoming orders with customer details
- Confirm and track order status

###  Technical Functionality

- Mobile-responsive design accessible on iOS and Android
- RESTful API backend
- Modular backend architecture to isolate components
- Database storage of all menus, orders, and table bookings

---

## Technologies Used

| Layer         | Technology        |
|--------------|-------------------|
| Frontend     | Next.js           |
| Backend      | Flask (Python)    |
| Database     | SQLite        |
| API          | REST API          |
| Authentication | (Optional) JWT or session-based |

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/OumaMichael/NextGen-Foodcourt
cd NextGen-Foodcourt
```

