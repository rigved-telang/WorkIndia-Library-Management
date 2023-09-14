# WorkIndia-Library-Management
# Library Management System

A simple library management system implemented in Node.js with an Express server and a MySQL database.

## Features

- User registration and authentication (admin and regular users).
- Admin can add, update, and delete books.
- Users can search for books by title.
- Users can check the availability of books.
- Users can borrow books with specified issue and return dates.
- Protection of admin API endpoints with an API key.
- Authorization token required for booking books.
- Handling of race conditions during booking.

## Tech Stack

- Node.js
- Express.js
- MySQL database
- bcrypt for password hashing
- JSON Web Tokens (JWT) for authentication
- uuid for generating unique IDs
- mysql2 for MySQL database interaction

