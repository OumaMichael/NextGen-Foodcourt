# NextGen Foodcourt

🚀 Overview

NextGen Foodcourt is a mobile-first food court ordering system for **Nextgen Mall**, Nairobi, digitizing food ordering and table booking across 20–30 cultural cuisine outlets under one unified platform.

## Architecture
- Frontend: Built with Next.js, Tailwind CSS for dynamic user interfaces.
- Backend: Built with Flask, utilizing SQLAlchemy for data handling.
- Authentication: JWT-based authentication
- Database:  SQLite.
- Deployment: Docker-based deployment utilizing Render and Vercel.

The platform enables:
- Customers to browse menus, place orders, and book tables in advance
- Outlet owners to manage their menus and track orders

## 🏗️ Architecture
```
┌─────────────────┐    ┌─────────────────┐    
│   Next.js       │◄──►│   Flask API     │    
│   Frontend      │    │   Backend       │    
│   (Port 3000)   │    │   (Port 5000)   │    
└─────────────────┘    └─────────────────┘    
         │                       │               
         ▼                       ▼               
┌─────────────────┐    ┌─────────────────┐    
│ Tailwind CSS    │    │                 │    
│ React           │    │  SQLite         │    
│                 │    │                 │    
└─────────────────┘    └─────────────────┘    
```

## ✨ Key Features

### 🎯 Core Functionality
- Multi-role authentication with JWT
- Menu browsing with filtering by cuisine, price, and category
- Cart and checkout functionality
- Table booking system
- Order management for outlet owners

### 🔧 Technical Features
- Server-Side Rendering (SSR) with Next.js App Router
- RESTful API with Flask
- Responsive design with Tailwind CSS
- Database migrations with Alembic
- Container deployment with Docker
- User-friendly alerts with SweetAlert2

## 🛠️ Tech Stack

### Frontend 
- Framework: Next.js with App Router
- UI Library: React
- Styling: Tailwind CSS
- Icons: Lucide React
- Authentication: JWT tokens
- State Management: React Context API
- Alert Messages: SweetAlert2

### Backend 
- Framework: Flask
- API: Flask-RESTful
- Database: SQLAlchemy + SQLite
- Authentication: Flask-JWT-Extended
- Migrations: Flask-Migrate + Alembic

### DevOps & Deployment
- Containerization: Docker
- Environment: Python & Vercel/Render
- Package Management: npm & pip
- Version Control: Git

## 🚀 Quick Start

### Prerequisites
- Install Node.js (18+) and Python (3.11+)

### 1. Clone the Repository
```bash
git clone https://github.com/OumaMichael/NextGen-Foodcourt
cd NextGen-Foodcourt
```

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── app/                       # Next.js App Router
│   ├── browse-cuisines/      # Cuisine browsing pages
│   ├── browse-outlets/       # Outlet browsing pages
│   ├── checkout/              # Checkout process pages
│   ├── login/                 # Authentication pages
│   ├── order/                 # Order management pages
│   ├── order-management/     # Order management pages
│   ├── owner-dashboard/       # Owner dashboard pages
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── menu/              # Menu management
│   │   ├── order-management/  # Order management
│   │   ├── reservations/      # Reservation management
│   │   └── page.tsx           # Main dashboard page
│   ├── popular-dishes/        # Popular dishes pages
│   ├── reservations/          # Table reservation pages
│   ├── reviews/               # Review management pages
│   ├── signup/                # User registration pages
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/                # UI components
│   ├── AuthGuard.tsx          # Authentication guard
│   ├── Footer.tsx             # Footer component
│   └── Header.tsx            # Header component
├── contexts/                  # React Context providers
│   └── AuthContext.tsx        # Authentication context
├── lib/                       # Utilities & config
│   ├── api.ts                 # API utility functions
│   ├── data.ts                # Data utility functions
│   └── utils.ts               # General utility functions
├── public/                    # Static assets
├── styles/                    # CSS styles
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

### Backend Structure
```
backend/
├── app.py                     # Flask application
├── config.py                  # Configuration
├── models.py                  # Database models
├── seed.py                    # Database seeding script
├── requirements.txt           # Python dependencies
├── Pipfile                    # Pipenv dependencies
├── Pipfile.lock              # Pipenv lock file
├── Dockerfile                 # Docker configuration
├── instance/                  # SQLite database instance
│   └── app.db                 # SQLite database file
└── migrations/                # Database migrations
    ├── alembic.ini           # Alembic configuration
    ├── env.py                # Migration environment
    ├── script.py.mako        # Migration script template
    └── versions/             # Migration versions
```

## 🎯 User Roles

### 👨‍👩‍👧‍👦 Customers
- Browse menus from all outlets
- Filter by cuisine, price, or category
- Add items to cart and place orders
- Book tables in advance

### 🏢 Outlet Owners
- Register and manage outlet profile
- Add, update, or delete menu items
- View incoming orders with customer details
- Confirm and track order status
- Manage reservations

## 🔐 Authentication & Security
- JWT tokens for user authentication and session management
- Role-based access control (RBAC)
- Input validation on all endpoints
- CORS protection for API security
- SQL injection prevention via ORM

## 📊 API Documentation

### Authentication Endpoints
- POST /register
- POST /login
- POST /logout
- GET /check-auth

### User Endpoints
- GET /users
- GET /users/{id}
- PATCH /users/{id}
- DELETE /users/{id}

### Cuisine Endpoints
- GET /cuisines
- POST /cuisines
- GET /cuisines/{id}
- PATCH /cuisines/{id}
- DELETE /cuisines/{id}

### Outlet Endpoints
- GET /outlets
- POST /outlets
- GET /outlets/{id}
- PATCH /outlets/{id}
- DELETE /outlets/{id}

### Menu Item Endpoints
- GET /menu-items
- POST /menu-items
- GET /menu-items/{id}
- PATCH /menu-items/{id}
- DELETE /menu-items/{id}

### Order Endpoints
- GET /orders
- POST /orders
- GET /orders/{id}
- PATCH /orders/{id}
- DELETE /orders/{id}

### Order Item Endpoints
- GET /order-items
- POST /order-items
- GET /order-items/{id}
- PATCH /order-items/{id}
- DELETE /order-items/{id}

### Table Endpoints
- GET /tables
- POST /tables
- GET /tables/{id}
- PATCH /tables/{id}
- DELETE /tables/{id}

### Reservation Endpoints
- GET /reservations
- POST /reservations
- GET /reservations/{id}
- PATCH /reservations/{id}
- DELETE /reservations/{id}

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments
- Tailwind CSS for styling framework

## 🔧 Troubleshooting

### Common Issues

#### Frontend Issues
- API connection errors: Verify the backend server is running on port 5000

#### Backend Issues
- Database connection errors:
  - For SQLite: Ensure the database file has proper permissions

#### Development Environment
- Package installation issues: Clear node_modules and package-lock.json, then reinstall
- Python virtual environment: Ensure you're in the activated virtual environment

## 🚀 Future Enhancements
- Real-time Chat: Enable direct communication between customers and outlet owners
- AI-powered Recommendations: Implement recommendations of similar dishes
- Payment Integration: Add Stripe and M-Pesa for diverse payment options
- Multilingual Support: Enable interface in multiple languages
- Mobile App: Native mobile applications for iOS and Android
- Notifications: Push notifications for order updates and messages

## 📞 Support
For support, email support@nextgenfoodcourt.com

## 👥 Team Members
| Name            | Contact / Profile        |
|--------------------------------------------|
| Joshua Gichuhi  | @Njugunaa                |
| Lewis Dickson   | @lewisdicksonn@gmail.com |
| Brendah Edward  | @b-edward28              |
| Michael Ouma    | @OumaMichael             |
| Jeannette Derek | @Gnett                   |
| Larry           | @Larr-y                  |

## 📄 License
This project is licensed under the MIT License 

Built with ❤️ by the NextGen Foodcourt Team
