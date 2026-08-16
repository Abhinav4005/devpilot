# DevPilot

A full-stack project management and collaboration tool built with a modern TypeScript stack. DevPilot provides workspace-based task and project management with a secure JWT authentication system and stateful invitation workflows.

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
| **Crypto (SHA-256)** | One-time invitation token hashing |
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
│   │   │   ├── services/         # TokenService (JWT) & token.types.ts
│   │   │   └── types/            # Express type augmentations
│   │   ├── config/
│   │   │   └── env.ts            # Zod-validated environment config
│   │   ├── database/
│   │   │   └── database.ts       # MongoDB connection
│   │   ├── modules/
│   │   │   ├── auth/             # Register, Login, Logout, Refresh, Me
│   │   │   ├── invitations/      # Create, Accept, Reject, Cancel invitations (SHA-256)
│   │   │   ├── workspace/        # Workspace creation, management, membership
│   │   │   ├── user/             # User models and repositories
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
├── docs/                         # Documentation & Architectural Decision Records
│   ├── adr/                      # Architectural Decision Records (ADR 001)
│   ├── api/                      # API spec docs
│   ├── lld/                      # Low-level design docs
│   └── requirements/             # Requirement analysis
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
└── docker/                       # Docker configuration (coming soon)
```

---

## Architectural Decision Records (ADRs)

DevPilot documents architectural choices to ensure design clarity and maintainability:
- **[ADR 001: Invitation Token Strategy](docs/adr/001-invitation-token-strategy.md)** — Evaluates JWT vs. Random One-Time Token strategy. Documents the choice of **Random One-Time Tokens hashed with SHA-256** for stateful invitations, instant revocation, single source of truth, and $O(1)$ database lookup performance.

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
   | `BCRYPT_SALT_ROUND` | bcrypt salt rounds for password hashing | `10` |

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
| `POST` | `/api/v1/auth/refresh-token` | ❌ | Refresh access token using refresh token cookie |
| `POST` | `/api/v1/auth/logout` | ❌ | Logout and clear auth cookies |

### Workspaces
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/v1/workspaces` | ✅ | Create a new workspace |
| `GET` | `/api/v1/workspaces` | ✅ | Get all workspaces of logged-in user |
| `GET` | `/api/v1/workspaces/:id` | ✅ | Get workspace details by ID |
| `PATCH` | `/api/v1/workspaces/:id` | ✅ | Update workspace details |
| `PATCH` | `/api/v1/workspaces/:id/archive` | ✅ | Archive workspace |
| `PATCH` | `/api/v1/workspaces/:id/unarchive` | ✅ | Unarchive workspace |

### Invitations
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/v1/workspaces/:workspaceId/invitations` | ✅ | Invite a user to workspace (Owner/Admin) |
| `POST` | `/api/v1/invitations/:token/accept` | ✅ | Accept an invitation token |
| `POST` | `/api/v1/invitations/:token/reject` | ✅ | Reject an invitation token |
| `DELETE` | `/api/v1/workspaces/:workspaceId/invitations/:invitationId` | ✅ | Cancel a pending invitation (Owner/Admin) |

---

## Authentication & Security Flow
- **Authentication**: On login, `accessToken` and `refreshToken` are set as `httpOnly`, `secure`, `SameSite=Lax` cookies.
- **Invitation Tokens**: High-entropy 256-bit random tokens are hashed with **SHA-256** prior to database storage, enabling $O(1)$ indexed lookups and instant revocation without token blacklists.
- **Race Condition Safety**: Workspace member creation and invitation status updates are wrapped in Mongoose transactions with unique composite indexes (`{ workspaceId: 1, userId: 1 }`).

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
| `preview` | `vite preview` | Preview production build locally |
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