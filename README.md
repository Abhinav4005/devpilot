# DevPilot

A full-stack project management and collaboration tool built with a modern TypeScript stack. DevPilot provides workspace-based task and project management with a secure JWT authentication system.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** + **Express 5** | HTTP server & routing |
| **TypeScript** | Type safety |
| **MongoDB** + **Mongoose** | Database & ODM |
| **Zod** | Environment & request validation |
| **JWT** (jsonwebtoken) | Access & refresh token auth |
| **bcryptjs** | Password hashing |
| **cors** | Cross-origin resource sharing |
| **cookie-parser** | HTTP cookie handling |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** + **TypeScript** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Redux Toolkit** | State management |
| **React Redux** | React-Redux bindings |

---

## Project Structure

```
devpilot/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── constants/        # HTTP status codes, etc.
│   │   │   ├── errors/           # AppError class
│   │   │   ├── middleware/       # async, auth, validate, authorize middlewares
│   │   │   ├── responses/        # ApiResponse class
│   │   │   ├── services/         # TokenService (JWT)
│   │   │   └── types/            # Express type augmentations
│   │   ├── config/
│   │   │   └── env.ts            # Zod-validated environment config
│   │   ├── database/
│   │   │   └── database.ts       # MongoDB connection
│   │   ├── modules/
│   │   │   ├── auth/             # Register, Login, Logout, Refresh, Me
│   │   │   ├── user/             # User model, interface, repository
│   │   │   ├── workspace/        # (coming soon)
│   │   │   ├── project/          # (coming soon)
│   │   │   └── task/             # (coming soon)
│   │   ├── routes/
│   │   │   ├── index.route.ts    # Root router
│   │   │   └── health.routes.ts  # Health check endpoint
│   │   └── index.ts              # App entry point
│   ├── .env                      # Environment variables (not committed)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios/fetch API clients
│   │   ├── components/           # Shared UI components
│   │   ├── features/             # Feature-level Redux slices
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # Page layout wrappers
│   │   ├── pages/                # Route-level page components
│   │   ├── routes/               # React Router config
│   │   ├── stores/               # Redux store setup
│   │   ├── services/             # Business logic / service layer
│   │   └── types/                # Shared TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                         # Product documentation
└── docker/                       # Docker configuration (coming soon)
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**

   Copy the example env file and fill in your values:
   ```bash
   cp src/config/.env.example .env
   ```

   | Variable | Description | Default |
   |---|---|---|
   | `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
   | `PORT` | Port the server listens on | `8000` |
   | `MONGODB_URI` | Full MongoDB connection URI | — |
   | `JWT_ACCESS_SECRET` | Secret for signing access tokens | — |
   | `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | — |
   | `ACCESS_TOKEN_EXPIRES_IN` | Access token expiry (e.g. `15m`) | `15m` |
   | `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry (e.g. `7d`) | `7d` |
   | `BCRYPT_SALT_ROUND` | bcrypt salt rounds for hashing | `10` |

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

3. **Build for production**
   ```bash
   npm run build
   ```

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Server health check |

### Auth
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | ❌ | Register a new user |
| `POST` | `/api/v1/auth/login` | ❌ | Login and receive tokens (set as `httpOnly` cookies) |
| `GET` | `/api/v1/auth/me` | ✅ | Get currently authenticated user |
| `POST` | `/api/v1/auth/refresh-token` | ❌ | Refresh the access token using the refresh token cookie |
| `POST` | `/api/v1/auth/logout` | ❌ | Logout and clear auth cookies |

### Authentication Flow
- On **login**, both `accessToken` and `refreshToken` are set as `httpOnly`, `secure`, `SameSite=Lax` cookies.
- The `accessToken` expires in `15m`. Use the `/refresh-token` endpoint to get a new one.
- The `refreshToken` is hashed with bcrypt before being stored in the database.
- On **logout**, both cookies are cleared and the refresh token is removed from the database.

---

## Scripts

### Backend
| Script | Command | Description |
|---|---|---|
| `dev` | `tsx watch src/index.ts` | Start dev server with hot reload |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/index.js` | Run compiled production build |

### Frontend
| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite dev server |
| `build` | `tsc -b && vite build` | Type-check and build for production |
| `preview` | `vite preview` | Preview the production build locally |
| `lint` | `eslint .` | Run ESLint |

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

ISC