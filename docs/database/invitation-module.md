# Invitation Module - Database Design

## Collections

- User
- Workspace
- WorkspaceMember
- Invitation

---

## Invitation Collection

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | ObjectId | Yes | Workspace Reference |
| userId | ObjectId | Yes | Invited User |
| invitedBy | ObjectId | Yes | Invitation Sender |
| email | String | Yes | Invite Email |
| role | Enum | Yes | Role after joining |
| status | Enum | Yes | Invitation Status |
| token | String | Yes | Invitation Token |
| expiresAt | Date | Yes | Expiration Time |
| acceptedAt | Date | No | Acceptance Timestamp |
| rejectedAt | Date | No | Rejection Timestamp |

---

## Relationships

Workspace (1) ------ (*) Invitation

User (1) ----------- (*) Invitation

Invitation (1) ----- (1) WorkspaceMember
(after acceptance)

---

## Indexes

### Single Indexes

- workspaceId
- userId
- expiresAt
- token

### Compound Index

(workspaceId, email, status)

Purpose:

Prevent multiple pending invitations.

---

## Constraints

- User must exist.
- Workspace must exist.
- Workspace must not be archived.
- Only OWNER/ADMIN can invite.
- Invitation expires after 7 days.

---

## Lifecycle

PENDING

↓

ACCEPTED

↓

History

OR

REJECTED

↓

History

OR

EXPIRED

↓

History

OR

CANCELLED

↓

History