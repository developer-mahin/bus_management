# Ticket Management System

This project implements a backend system for managing bus tickets using Node.js, Express.js, Mongoose, and a modular design pattern. Optionally, TypeScript can be used for enhanced type safety.

## Objective

Develop a system for users to purchase tickets for specific buses at specified times.
Implement user authentication, role-based authorization (admin and user), and ticketing functionalities.

#### SERVER_URL : https://busticketmanagement.vercel.app/

### API DOCUMENTATION LINK

- URL- https://documenter.getpostman.com/view/24264729/2sAYJ6Bzib

## Technologies

```
  * Backend :
      - TypeScript, Node.js, Express.js, MongoDB, Mongoose, Zod, Bcrypt, JWT
```

## Features

- **User Authentication and Authorization:** Secure user registration, login, and logout functionalities with JWT-based authentication and role-based access control (Admin/User).
- **Bus Management (Admin):** APIs for admins to add, update, and delete bus information, including details like bus name, number, image, driver information, number of seats, route, and description.
- **Ticket Management (Admin):** Functionality for admins to create, update, and delete tickets associated with specific buses and time slots, including price and availability.
- **Ticket Purchasing (User):** Users can browse available buses and tickets, select seats, and purchase tickets for specific trips.

## How to run

- First, clone the repo and install the dependencies using `npm install` command.
- Create a `.env` file in the root directory and add the following environment variables:

```
DATABASE_URL="mongodb://localhost:27017/bus_management"
JWT_SECRET= <Your JWT Secret>
NODE_ENV="development"
PORT=5000
SALT_ROUND=10
ACCESS_KEY="3f9848e84df91405d7fb29fb69b07021a93acddc7319f8e188ef61f3fdf18a239c8d6c7fee70686d5d5070b82710e8ba99c2842bc05555946852e66ccdbadad1"
ACCESS_EXPIRE_IN="5d"
REFRESH_KEY="8c3197240b4161bd0b834864fc49a57c6720b4954715b565abe99e91939f02bf25112607890af51c2a3daecc6368d2c735a61cfa2c2860c3f1449520d3f629bd"
REFRESH_EXPIRE_IN="30d"

ADMIN_EMAIL= <Your Admin Email>
ADMIN_PASSWORD= <Your Admin Password>
ADMIN_NAME= <Your Admin Name>
ADMIN_CONTACT_NO= <Your Admin Contact>
ADMIN_PROFILE_IMAGE= <Your Admin Image>
```

- then, build the project using `npm run build` command.
- at last, run the project using `npm run dev` command.

## Demo Login Credentials

```
* Admin:
{
    "email": "a0dH1@example.com",
    "password": "12345678"
}
* User
{
    "email": "alice.johnson@example.com",
    "password": "password123"
}
```
