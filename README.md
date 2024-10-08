﻿# Ksolves-hackathon-backend
 # Virtual Classroom Backend

This is the backend for the Virtual Classroom application, built using Node.js, Express, and MongoDB. It provides the API endpoints for user authentication, class management, and other functionalities required by the Virtual Classroom frontend.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Register and login users with JWT-based authentication.
- **Class Management**: Instructors can create and manage classes, units (books), and sessions (chapters).
- **Discussion System**: Allow commenting and nested replies on lectures.
- **Role-Based Access Control**: Different permissions for instructors and students.

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/virtual-classroom-backend.git
    cd virtual-classroom-backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `.env` file**:

    Copy the example `.env.example` file to `.env` and configure your environment variables:

    ```bash
    cp .env.example .env
    ```

    Edit `.env` to include your MongoDB connection string and other configurations:

    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/VirtualClassroom?retryWrites=true&w=majority
    JWT_SECRET=your_jwt_secret
    ```

## Usage

1. **Start the server**:

    ```bash
    npm start
    ```

    This will start the backend server on `http://localhost:5000`.

2. **Run tests**:

    ```bash
    npm test
    ```

    This will run the test suite for the backend.

## API Endpoints

### Authentication

- **Register**
  - `POST /api/auth/register`
  - Request Body: `{ "username": "string", "password": "string", "role": "string" }`
  - Response: `{ "message": "User created" }`

- **Login**
  - `POST /api/auth/login`
  - Request Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token" }`

### Classes

- **Create Class**
  - `POST /api/classes`
  - Request Body: `{ "name": "string", "instructorId": "string" }`
  - Response: `{ "class": "class_object" }`

- **Add Unit to Class**
  - `POST /api/classes/:classId/units`
  - Request Body: `{ "title": "string", "description": "string" }`
  - Response: `{ "unit": "unit_object" }`

- **Add Session to Unit**
  - `POST /api/classes/:classId/units/:unitIndex/sessions`
  - Request Body: `{ "title": "string", "content": "string" }`
  - Response: `{ "session": "session_object" }`

### Discussion

- **Add Comment**
  - `POST /api/classes/:classId/sessions/:sessionId/comments`
  - Request Body: `{ "text": "string", "parentId": "string" }`
  - Response: `{ "comment": "comment_object" }`

## Folder Structure

- **`models/`**: Mongoose models for MongoDB collections
  - **`User.js`**: User schema
  - **`Class.js`**: Class schema
  - **`Unit.js`**: Unit schema
  - **`Session.js`**: Session schema
  - **`Comment.js`**: Comment schema

- **`routes/`**: Express routes
  - **`auth.js`**: Authentication routes
  - **`classes.js`**: Class management routes

- **`controllers/`**: Route handlers
  - **`authController.js`**: Authentication logic
  - **`classController.js`**: Class management logic

- **`config/`**: Configuration files
  - **`db.js`**: MongoDB connection setup

- **`middleware/`**: Express middleware
  - **`authMiddleware.js`**: Authentication and authorization middleware

- **`server.js`**: Main server file

## Environment Variables

- **`PORT`**: Port to run the server (default: `5000`)
- **`MONGO_URI`**: MongoDB connection string
- **`JWT_SECRET`**: Secret key for JWT authentication

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Open a pull request with a clear description of your changes.
