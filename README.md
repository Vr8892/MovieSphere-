# MovieSphere

MovieSphere is a static movie-discovery frontend with an Express/MongoDB authentication API.

## Run locally

1. In `backend`, copy `.env.example` to `.env` and set `MONGO_URL` and `JWT_SECRET`.
2. Run `npm install` and then `npm start` from `backend`.
3. Serve this folder using any static web server and open `index.html` in the browser. The API runs at `http://localhost:5002`.

Movie results and details are provided by OMDb. If MongoDB is unavailable during local development, authentication automatically uses a local, git-ignored account store with bcrypt-hashed passwords.
