# Bank App

## Overview

This project is a simple banking application with two backend services: **Account Manager Service** and **Payment Manager Service**. The Account Manager Service uses Supabase for authentication, while the Payment Manager Service also uses Supabase to ensure secure transactions.

## Features

- **User Authentication**: Register and login using Supabase.
- **Manage Payment Accounts**: Users can create and view payment accounts.
- **Transactions**: Users can send and withdraw money.
- **Dockerized**: Easily deploy using Docker and Docker Compose.

## Tech Stack

- **Node.js** with **Fastify** for the backend API server.
- **Prisma ORM** with **PostgreSQL** for database management.
- **Supabase** for authentication.
- **Docker** for containerization.

## Directory Structure

```plaintext
bank-app/
├── account-manager/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── payment-manager/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
└── docker-compose.yml

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Supabase account and project.

### Configuration

1. Set up a Supabase project and note your Supabase URL and anon key.
2. Update the Supabase URL and anon key in `account-manager/index.js` and `payment-manager/index.js`.

### Running the Application

1. Clone the Repository:

    ```bash
    git clone <repository_url>
    cd bank-app
    ```

2. Build and Run the Application:

    ```bash
    docker-compose up --build
    ```

### Accessing the Services

- **Account Manager Service:** Runs on [http://localhost:3001](http://localhost:3001)
- **Payment Manager Service:** Runs on [http://localhost:3002](http://localhost:3002)

### API Endpoints

#### Account Manager Service

- **POST /register:** Register a new user with email and password.
    - **Request Body:** 
        ```json
        { "email": "user@example.com", "password": "pass123" }
        ```

- **POST /login:** Login with a registered user.
    - **Request Body:** 
        ```json
        { "email": "user@example.com", "password": "pass123" }
        ```
    - **Response:** 
        ```json
        { "token": "<JWT Token>" }
        ```

- **GET /accounts:** Get all payment accounts for the logged-in user.
    - **Headers:** 
        ```http
        Authorization: Bearer <JWT Token>
        ```

#### Payment Manager Service

- **POST /send:** Send money from one account to another.
    - **Request Body:** 
        ```json
        { "fromAccount": 1, "toAccount": 2, "amount": 100 }
        ```
    - **Headers:** 
        ```http
        Authorization: Bearer <JWT Token>
        ```

- **POST /withdraw:** Withdraw money from an account.
    - **Request Body:** 
        ```json
        { "fromAccount": 1, "amount": 50 }
        ```
    - **Headers:** 
        ```http
        Authorization: Bearer <JWT Token>
        ```

### Environment Variables

Ensure that you replace placeholders in `account-manager/index.js` and `payment-manager/index.js` with actual Supabase credentials.

### Stopping the Application

To stop the application, run:

```bash
docker-compose down


## Notes

- Ensure passwords are hashed in production.
- Adjust the `processTransaction` function and any other business logic as needed.

## License

This project is licensed under the MIT License.
