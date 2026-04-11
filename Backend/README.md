# Backend Authentication API

This backend uses Express, Mongoose, dotenv, cookie-parser, and express-validator for token-based authentication.

## Folder Structure

```text
Backend
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── utils
│   ├── validators
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Setup

1. Open the `Backend` folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Update `MONGO_URI` and `JWT_SECRET`.
5. Run `npm run dev`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`

## Token Usage

- On login and register, the API returns a JWT token.
- The token is also stored in an HTTP-only cookie named `token`.
- Protected routes can use the cookie or `Authorization: Bearer <token>`.
