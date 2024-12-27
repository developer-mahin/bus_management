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
