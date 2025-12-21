# Blood Donation Application - Client

## Overview
Frontend application for the Blood Donation platform built with React. This application provides a user-friendly interface for donors, volunteers, and administrators to manage blood donation activities.

## Live URL
(https://blood-donation-client-iota.vercel.app/)

## Purpose
The Blood Donation Application connects blood donors with those in need, facilitating a seamless donation process. It enables users to:
- Register as blood donors
- Create and manage donation requests
- Search for donors by location and blood group
- Make financial contributions to support the organization
- Administer the platform (for admins)

## Key Features
- 🔐 User Authentication (Firebase + JWT)
- 👤 User Registration & Profile Management
- 🩸 Donation Request Management
- 🔍 Donor Search by Location & Blood Group
- 💰 Funding System with Stripe Integration
- 📊 Admin Dashboard with Statistics
- 🎭 Role-Based Access Control (Admin, Donor, Volunteer)
- 📱 Fully Responsive Design
- 🎨 Modern UI with Animations (AOS, Framer Motion)

## Tech Stack
- **React** - UI library
- **React Router** - Routing
- **Firebase** - Authentication
- **Axios** - HTTP client
- **Stripe** - Payment processing
- **React Hot Toast** - Notifications
- **AOS** - Scroll animations
- **Framer Motion** - Advanced animations

## NPM Packages Used

### Core Dependencies
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.20.1
- `react-scripts`: 5.0.1

### Authentication & API
- `firebase`: ^10.7.1
- `axios`: ^1.6.2

### Payment Processing
- `@stripe/stripe-js`: ^2.2.0
- `@stripe/react-stripe-js`: ^2.4.0

### UI & Animations
- `react-hot-toast`: ^2.4.1
- `react-icons`: ^4.12.0
- `framer-motion`: ^10.16.16
- `aos`: ^2.3.4

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_IMGBB_API_KEY=your_imgbb_api_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

3. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Dashboard/      # Dashboard layout components
│   ├── Navbar.js       # Navigation bar
│   ├── Footer.js       # Footer component
│   └── ContactUs.js     # Contact form
├── pages/              # Page components
│   ├── Dashboard/      # Dashboard pages
│   ├── Home.js         # Home page
│   ├── Login.js        # Login page
│   └── Register.js     # Registration page
├── context/            # React context providers
│   └── AuthContext.js  # Authentication context
├── utils/              # Utility functions
│   ├── api.js          # API configuration
│   ├── imageUpload.js  # Image upload utility
│   └── districtsUpazilas.js  # Location data
├── App.js              # Main app component
└── index.js            # Entry point
```

## Features Breakdown

### Public Pages
- **Home**: Landing page with banner, features, and contact form
- **Search Donors**: Search for donors by blood group and location
- **Donation Requests**: View all pending donation requests

### Authentication
- **Login**: User login with email and password
- **Register**: User registration with profile information

### Dashboard (Protected)
- **Profile**: View and edit user profile
- **My Donation Requests**: Manage personal donation requests (Donors)
- **Create Donation Request**: Create new donation requests (Donors)
- **All Users**: Manage all users (Admin only)
- **All Blood Donation Requests**: Manage all requests (Admin/Volunteer)
- **Funding**: View funding history and make donations

## Environment Variables

All sensitive configuration is stored in environment variables:
- Firebase credentials
- API endpoints
- ImageBB API key
- Stripe publishable key

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set environment variables
3. Build command: `npm run build`
4. Publish directory: `build`
5. Add your domain to Firebase authorized domains

## Important Notes

- Ensure all environment variables are set before running
- Add your deployment domain to Firebase authorized domains
- The app requires the backend server to be running
- District/Upazila data should be updated from the bangladesh-geocode repository

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of an assignment/project submission.

---

**Note**: Remember to update the live URL and ensure all environment variables are properly configured before deployment.

