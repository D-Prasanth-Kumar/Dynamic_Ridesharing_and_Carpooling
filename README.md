# ShareWheels 🚗

ShareWheels is a smart, eco-friendly carpooling platform designed to simplify daily commutes. It connects drivers with empty seats to passengers looking for a ride, reducing traffic congestion and carbon emissions. Built with modern web technologies, ShareWheels features real-time ride tracking, secure booking management, and automated email notifications.

## Features

- **Smart Ride Matching**: Algorithmically matches passengers with suitable drivers based on route and schedule.
- **Role-Based Access**: Dedicated dashboards for Passengers, Drivers, and Administrators with role-specific functionalities.
- **Secure Authentication**: JWT-based authentication with Spring Security ensuring safe login and data protection.
- **Real-Time Booking**: Instant booking confirmation with live seat availability updates.
- **Automated Notifications**: Email alerts for booking confirmations, ride cancellations, and OTP verification (JavaMailSender).
- **Cross-Platform**: Fully responsive frontend built with React and Vite, accessible on desktop and mobile.
- **Cloud Deployment**: Backend deployed on Render (Dockerized) and frontend on Vercel for high availability.

## Tech Stack

- **Frontend**: React, Vite, Axios
- **Backend**: Java, Spring Boot , Spring Security, Spring Data JPA
- **Database**: MySQL (Aiven Cloud)
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Docker, Render (Backend), Vercel (Frontend)

## Live Demo

- **Frontend (Vercel)**: [https://sharewheels.vercel.app](https://sharewheels.vercel.app)
- **Backend API (Render)**: [https://sharewheels-wart.onrender.com](https://sharewheels-wart.onrender.com)

## Quick Start (Run Locally)

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL Database
- Maven

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/D-Prasanth-Kumar/Dynamic_Ridesharing_and_Carpooling.git
   cd Dynamic_Ridesharing_and_Carpooling
   ```

2. **Backend Setup (Spring Boot):**
   
   Configure database credentials in src/main/resources/application.properties:
   ```bash
   spring.datasource.url=jdbc:mysql://localhost:3306/sharewheels
   spring.datasource.username=root
   spring.datasource.password=yourpassword
  
   # Mail Configuration
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
  
   # JWT Configuration
   jwt.secret=your_super_secret_key_here
   ```

   Run the application:
   ```bash
   mvn spring-boot:run
   ```

3. **Frontend Setup (React + Vite):**

   Open a new terminal and navigate to the frontend folder:
   ```bash
   cd sharewheels-frontend
   ```

   Install dependencies:
   ```bash
   npm install
   ```

   Set up environment variables: Create a .env file inside sharewheels-frontend/ and add:
   ```bash
   VITE_API_URL=http://localhost:8080
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the App:** Open your browser and visit http://localhost:5173.

## Project Structure:
  ```
  Dynamic_Ridesharing_and_Carpooling/
  ├── Dockerfile                  # Deployment configuration for Render
  ├── pom.xml                     # Maven dependencies
  ├── src/
  │   ├── main/java/com/project/ridesharing/
  │   │   ├── controller/         # REST Controllers (Auth, Rides, Bookings)
  │   │   ├── dto/                # Data Transfer Objects
  │   │   ├── model/              # JPA Entities (User, Ride, Booking)
  │   │   ├── repository/         # Database Repositories
  │   │   ├── service/            # Business Logic
  │   │   ├── config/             # Security & CORS Configuration
  │   │   └── security/           # JWT Filters & Auth Logic
  │   └── main/resources/
  │       └── application.properties
  ├── sharewheels-frontend/       # React Application
  │   ├── src/
  │   │   ├── components/         # Reusable UI (Navbar, Cards)
  │   │   ├── pages/              # Views (Login, Dashboard, Ride Search)
  │   │   ├── services/           # API Handling (Axios)
  │   │   ├── context/            # Auth State Management
  │   │   └── assets/             # Images & CSS
  │   ├── vercel.json             # Vercel deployment config
  │   ├── package.json
  │   └── vite.config.js
  └── README.md
  ```

## API Endpoints

**Authentication**

POST /api/auth/register - Register a new user (Driver/Passenger)

POST /api/auth/login - Authenticate user and return JWT

POST /api/auth/verify-otp - Verify email OTP

**Rides**

POST /api/rides/create - Create a new ride (Driver only)

GET /api/rides/search - Search for available rides

GET /api/rides/{id} - Get ride details

PUT /api/rides/{id}/status - Update ride status (e.g., COMPLETED)

**Bookings**

POST /api/bookings/book - Book a seat on a ride

GET /api/bookings/my-bookings - Get current user's booking history

DELETE /api/bookings/{id} - Cancel a booking

## Deployment Guide

**Backend (Render):**
- Push code to GitHub.

- Create a new Web Service on Render.

- Select the repository.

- Set Runtime to Docker.

- Add Environment Variables (DB_URL, JWT_SECRET, etc.).

- Deploy.

**Frontend (Vercel):**
- Import the repository into Vercel.

- Set Root Directory to sharewheels-frontend.

- Add Environment Variable: VITE_API_URL = https://your-backend-url.onrender.com.

- Deploy.

## Contributing
**Contributions are welcome! Please fork the repository and submit a pull request for review.**
- Fork the Project

- Create your Feature Branch (git checkout -b feature/Feature Description)

- Commit your Changes (git commit -m 'Add some AmazingFeature')

- Push to the Branch (git push origin feature/AmazingFeature)

- Open a Pull Request


     
