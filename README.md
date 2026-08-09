# MovieSphere Backend API

MovieSphere is a backend-first movie platform API built with Node.js, Express, and MongoDB.
It provides secure authentication plus movie CRUD endpoints for creating, browsing, updating,
and deleting movie records.

## What it provides

- JWT-based user registration and login
- Protected movie creation, update, and delete routes
- Public movie listing, search, and details endpoints
- Movie statistics endpoint for totals and genre breakdown
- MongoDB-backed authentication with a local JSON movie store for reliable demos
- Trailer lookup support from the existing server layer

## API overview

- `POST /api/users/register` - create an account
- `POST /api/users/login` - sign in and receive a JWT token
- `GET /api/users/profile` - protected profile route
- `GET /api/movies` - list movies with optional `search`, `genre`, and `year` filters
- `GET /api/movies/:id` - get one movie by id
- `GET /api/movies/stats` - get backend movie statistics
- `POST /api/movies` - create a movie record, protected by JWT
- `PUT /api/movies/:id` - update a movie record, protected by JWT
- `DELETE /api/movies/:id` - delete a movie record, protected by JWT

## Run locally

1. In `backend`, copy `.env.example` to `.env` and set `MONGO_URL`, `JWT_SECRET`, and optionally `PORT`.
2. Run `npm install` and then `npm start` from `backend`.
3. The server runs on `http://localhost:5002` by default.

If MongoDB is unavailable, the authentication API falls back to the local user store, while movie data is always served from the local JSON collection so the backend remains demoable.
