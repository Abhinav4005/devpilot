# ADR 001: Invitation Token Strategy (JWT vs. Random One-Time Token)

- **Status**: Accepted
- **Date**: 2026-08-09
- **Deciders**: DevPilot Engineering Team
- **Module**: Invitation Module (`backend/src/modules/invitations`)

---

## Context and Problem Statement

When implementing the workspace invitation feature in DevPilot, we needed to decide how invitation tokens sent to users via email links (`/invitations/<token>/accept`) should be generated, signed/hashed, verified, and invalidated.

Specifically, we evaluated two architectural approaches:
1. **Option A — JWT Invitation Token**: Self-contained, signed JSON Web Tokens.
2. **Option B — Random One-Time Token**: Unguessable random bytes stored securely as a hash in the database.

---

## Decision Drivers

- **Security & Integrity**: Prevent token tampering and replay attacks.
- **Revocation & Statefulness**: Ability to immediately invalidate invitations upon cancellation, expiration, or acceptance.
- **Single Source of Truth**: Clear, un-conflicting authority for invitation status and expiration.
- **Architectural Separation**: Clean boundary between session authentication tokens and one-time transaction tokens.

---

## Considered Options

### Option A — JWT Invitation Token

#### Flow
```
Create Invitation
      │
      ▼
JWT.sign({ invitationId, userId, workspaceId })
      │
      ▼
Store JWT / Send via Email
      │
      ▼
Client hits: /invitations/<jwt>/accept
      │
      ▼
Accept Handler:
  1. JWT.verify(token)
  2. Extract payload (invitationId, userId, workspaceId)
  3. Fetch invitation from DB
  4. Perform status / expiry / user check
  5. Mark accepted
```

#### Advantages
- **Payload Transport**: Can store context (`invitationId`, `userId`, `workspaceId`) directly inside the token payload.
- **Self-contained Expiry**: Expiration can be naturally handled via the JWT `exp` claim.
- **Tamper-proof**: Cryptographic signature prevents client-side tampering.
- **Service Reuse**: Reuses existing `TokenService` infrastructure.

#### Disadvantages / Key Problems
- **Invitation is inherently a stateful resource**: Even if a JWT has a valid signature and has not expired according to its `exp` claim, the underlying invitation state in the DB might be `CANCELLED` or already `ACCEPTED`. Therefore, **a database check remains mandatory** regardless of JWT validity.
- **Dual Expiry Sources**: Setting an expiry in both the JWT (`exp` claim) and the DB (`expiresAt` column) introduces two sources of truth that can fall out of sync.
- **Revocation Complexity**: Revoking a JWT before its expiration requires blacklist management or DB lookup, defeating the core advantage of stateless JWTs.

---

### Option B — Random One-Time Token (Selected)

#### Flow
```
Create Invitation:
  1. const rawToken = crypto.randomBytes(32).toString("hex")
  2. Save hash(rawToken) in Database
  3. Send rawToken via email link: /invitations/<rawToken>/accept

Accept Handler:
  1. Receive rawToken from request
  2. Locate invitation by matching hash(rawToken) / query
  3. Perform DB verification:
     - Check status === PENDING
     - Check expiresAt > current_time
     - Check email/userId matches recipient
  4. On successful accept:
     - Update status = ACCEPTED
     - Invalidate token (set token = null / tokenHash = null)
```

#### Advantages
1. **Purpose-Specific & Clean Separation**: JWTs are reserved for session authentication, whereas random one-time tokens are used for specific transactional actions (invitations, password resets). This enforces clean architectural boundaries.
2. **Naturally Easy Revocation**: Setting `status = CANCELLED` or `token = null` in the database immediately and cleanly revokes the token without needing token blacklists.
3. **Strict One-Time Use**: Once accepted (`PENDING` → `ACCEPTED`), the token is cleared (`token = null`), preventing replay attacks.
4. **Database is the Single Source of Truth**: All invitation lifecycle properties (`status`, `expiresAt`, `userId`, `workspaceId`) live exclusively in the database.

---

## Decision Outcome

**Selected Option**: **Option B — Random One-Time Token**

### Justification
Invitations are fundamentally stateful entities whose validity depends on real-time application state (invitation status, workspace state, inviter rights, prior acceptance/cancellation). Using JWTs provides false statelessness because DB lookups are still mandatory. Option B provides a cleaner separation of concerns, seamless immediate revocation, strict one-time usage, and avoids dual-expiry anti-patterns.

---

## Implementation Details

- **Token Generation**: Generated using Node.js native `crypto.randomBytes(32).toString("hex")` (256-bit entropy).
- **Token Hashing (Deterministic SHA-256 vs. Salted Bcrypt)**:
  - **Why SHA-256?**: SHA-256 provides **deterministic hashing** (`crypto.createHash('sha256').update(rawToken).digest('hex')`). This allows querying MongoDB with `findOne({ token: sha256(rawToken) })` in an **$O(1)$ indexed lookup**.
  - **Why not Bcrypt?**: Bcrypt generates a random salt for every hash operation (`$2a$10$...`). Because `sha256` or `bcrypt` cannot be queried directly if salted, querying `findOne({ token: rawToken })` against a bcrypt hash would always fail.
  - **Security**: Because `crypto.randomBytes(32)` provides 256 bits of high entropy (unguessable), salting and slow work factors (like bcrypt) are unnecessary to protect against dictionary attacks. SHA-256 provides secure, one-way storage while preserving instant $O(1)$ lookup performance.
- **Verification & Invalidation**: Handled in `InvitationService` (`backend/src/modules/invitations/invitation.service.ts`). On acceptance/cancellation, status updates and token invalidation occur atomically.
