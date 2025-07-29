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

# Deployment to Render

This document explains how to deploy the NextGen Food Court application to Render.

## Architecture

The application consists of three main components:
1. **Frontend**: Next.js application
2. **Backend**: Flask API
3. **Database**: PostgreSQL (provided by Render)

## Deployment Steps

### 1. Create a Render Account

If you don't have a Render account, create one at [https://render.com](https://render.com).

### 2. Fork the Repository

Fork this repository to your GitHub account so you can connect it to Render.

### 3. Connect to Render

1. Go to your Render dashboard
2. Click "New Web Service"
3. Connect your GitHub account
4. Select your forked repository

### 4. Configure Services

Render will automatically detect the `render.yaml` file and configure both services:

#### Backend Service
- **Name**: nextgen-foodcourt-backend
- **Environment**: Python
- **Root Directory**: backend
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`

#### Frontend Service
- **Name**: nextgen-foodcourt-frontend
- **Environment**: Node
- **Root Directory**: frontend
- **Build Command**: `./build.sh`
- **Start Command**: `npm run start`
- **Static Publish Path**: out

#### Database
- **Name**: nextgen-foodcourt-db
- **Plan**: Free

### 5. Environment Variables

Render will automatically set the following environment variables:

For the backend:
- `DATABASE_URL` - Provided by Render's database service
- `JWT_SECRET_KEY` - You should set this to a secure random value
- `FLASK_ENV` - Set to "production"

For the frontend:
- `NEXT_PUBLIC_API_URL` - Automatically set to the backend service URL

### 6. Deploy

Click "Create Web Service" and Render will:
1. Create the PostgreSQL database
2. Build and deploy the backend service
3. Build and deploy the frontend service

## Post-Deployment Steps

### 1. Set JWT Secret Key

After deployment, go to the backend service settings and add an environment variable:
- Key: `JWT_SECRET_KEY`
- Value: A secure random string (at least 32 characters)

### 2. Run Database Migrations

You'll need to run the initial database migrations. You can do this by:
1. Going to the backend service shell in Render
2. Running: `flask db upgrade`

### 3. Seed Initial Data (Optional)

If you want to seed the database with initial data:
1. Go to the backend service shell in Render
2. Run: `python seed.py`

## Updating the Application

To update the application after making changes:
1. Push your changes to your GitHub repository
2. Render will automatically detect the changes and start a new deployment
3. You can monitor the deployment progress in the Render dashboard

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the `FRONTEND_URL` environment variable is set correctly in the backend service.

2. **Database Connection Issues**: Ensure the `DATABASE_URL` environment variable is correctly set by Render.

3. **API Not Accessible**: Check that the backend service is running and the `NEXT_PUBLIC_API_URL` is correctly set in the frontend.

### Checking Logs

You can view logs for each service in the Render dashboard:
1. Go to your service
2. Click on "Logs" tab
3. View real-time or historical logs

## Scaling

The free tier is sufficient for development and small production workloads. For higher traffic applications, consider upgrading to a paid plan.