# Rakht Setu (Life Bridge)

Rakht Setu (Life Bridge) is a comprehensive blood donation management platform that connects blood donors with recipients in need. The application facilitates blood donation requests, donor registration, blood pickup scheduling, and donation tracking.

![Rakht Setu](client/public/favicon.ico)

## Features

- **User Authentication**: Secure registration and login system for donors, recipients, and administrators
- **Blood Donation Requests**: Recipients can create blood donation requests specifying blood group and units needed
- **Donor Registration**: Users can register as blood donors and provide their blood group information
- **Blood Pickup Scheduling**: Coordinate blood pickup from donors
- **Admin Dashboard**: Administrative interface for managing users, donations, and requests
- **Email Notifications**: Automated email notifications for donation requests and confirmations
- **User Profiles**: Manage personal information and donation history

## Project Structure

The project is divided into two main parts:

- **Client**: React-based frontend application
- **Server**: Node.js/Express backend API

## Technology Stack

### Frontend
- React 19
- React Router 7
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email functionality
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setting up the Server

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/lifebridge
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

   Note: For email functionality, follow the instructions in the server README for setting up Gmail with App Passwords.

4. Start the development server:
   ```
   npm run dev
   ```

### Setting up the Client

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

### User Types

1. **Donors**: Can register, view donation requests, and schedule donations
2. **Recipients**: Can register, create blood requests, and track request status
3. **Administrators**: Can manage users, donations, and requests

### Default Admin Account

A default admin account is created automatically when the server starts if no admin exists. Check the server logs for details.

## Email Configuration

To enable email functionality:

1. Create or use an existing Gmail account
2. Enable 2-Step Verification in your Google Account settings
3. Generate an App Password for the application
4. Update the `.env` file with your Gmail address and App Password

For detailed instructions, refer to the server README.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
