# Invitation Module - API Design

## Overview

The Invitation module allows Workspace Owners and Admins to invite existing users to join a workspace securely.

All APIs require authentication unless explicitly stated otherwise.

---

# Base URL

```
/api/v1
```

---

# Authentication

All endpoints require a valid Access Token.

```
Authorization: Bearer <access_token>
```

---

# Standard Response Format

## Success Response

```json
{
    "success": true,
    "statusCode": 200,
    "message": "Operation completed successfully",
    "data": {},
    "meta": null
}
```

---

## Error Response

```json
{
    "success": false,
    "statusCode": 400,
    "message": "Validation Failed",
    "errors": []
}
```

---

# API 1 - Create Invitation

## Endpoint

```
POST /workspaces/:workspaceId/invitations
```

---

## Authorization

Required

Allowed Roles

- OWNER
- ADMIN

---

## Request Body

```json
{
    "email": "abhi@gmail.com",
    "role": "MEMBER"
}
```

---

## Success Response

**201 Created**

```json
{
    "success": true,
    "message": "Invitation sent successfully",
    "data": {
        "id": "...",
        "workspaceId": "...",
        "email": "abhi@gmail.com",
        "role": "MEMBER",
        "status": "PENDING",
        "expiresAt": "2026-08-15T10:00:00Z"
    }
}
```

---

## Possible Errors

- Workspace not found
- Workspace is archived
- User not found
- User already member
- Pending invitation already exists
- Unauthorized

---

# API 2 - List Workspace Invitations

## Endpoint

```
GET /workspaces/:workspaceId/invitations
```

---

## Authorization

Required

Allowed Roles

- OWNER
- ADMIN

---

## Success Response

**200 OK**

```json
{
    "success": true,
    "data": [
        {
            "email": "abhi@gmail.com",
            "role": "MEMBER",
            "status": "PENDING"
        }
    ]
}
```

---

## Possible Errors

- Workspace not found
- Unauthorized

---

# API 3 - Accept Invitation

## Endpoint

```
POST /invitations/:token/accept
```

---

## Authorization

Required

Logged in user must match invitation email.

---

## Request Body

No Request Body

---

## Success Response

**200 OK**

```json
{
    "success": true,
    "message": "Invitation accepted successfully"
}
```

---

## Business Flow

```
Validate Token

↓

Validate Invitation

↓

Validate Workspace

↓

Validate Logged-in User

↓

Start Transaction

↓

Create WorkspaceMember

↓

Update Invitation Status

↓

Commit Transaction
```

---

## Possible Errors

- Invitation not found
- Invitation expired
- Invitation already accepted
- Invitation rejected
- Invitation cancelled
- Workspace archived
- Workspace deleted
- Unauthorized

---

# API 4 - Reject Invitation

## Endpoint

```
POST /invitations/:token/reject
```

---

## Authorization

Required

Logged in user must match invitation email.

---

## Request Body

No Request Body

---

## Success Response

**200 OK**

```json
{
    "success": true,
    "message": "Invitation rejected successfully"
}
```

---

## Possible Errors

- Invitation not found
- Invitation expired
- Invitation already processed
- Unauthorized

---

# API 5 - Cancel Invitation

## Endpoint

```
PATCH /invitations/:id/cancel
```

---

## Authorization

Required

Allowed Roles

- OWNER
- ADMIN

---

## Request Body

No Request Body

---

## Success Response

**200 OK**

```json
{
    "success": true,
    "message": "Invitation cancelled successfully"
}
```

---

## Business Flow

```
Validate Workspace

↓

Validate Permission

↓

Find Invitation

↓

Status = CANCELLED

↓

Invalidate Token

↓

Return Success
```

---

## Possible Errors

- Invitation not found
- Invitation already accepted
- Invitation already cancelled
- Unauthorized

---

# HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Validation Failed |
| 401 | Authentication Required |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# Validation Rules

## Create Invitation

- Email must be valid.
- Role must be a valid WorkspaceRole.
- WorkspaceId must be a valid ObjectId.

---

## Accept Invitation

- Token must exist.
- Token must not be expired.
- Logged-in email must match invitation email.

---

## Reject Invitation

- Same validation as Accept.

---

## Cancel Invitation

- Invitation must be in PENDING state.
- User must be OWNER or ADMIN.

---

# API Security

- Authentication required for every endpoint.
- Authorization required based on workspace role.
- Token must be one-time usable.
- Expired invitations cannot be reused.
- Cancelled invitations cannot be reused.
- Accepted invitations cannot be reused.
- Rejected invitations cannot be reused.
- Logged-in user must match invitation email.

---

# Idempotency

## Accept Invitation

Calling Accept multiple times should not create multiple WorkspaceMembers.

Already accepted invitation returns:

```
Invitation is no longer valid.
```

---

## Reject Invitation

Rejecting an already rejected invitation returns:

```
Invitation is no longer valid.
```

---

## Cancel Invitation

Cancelling an already cancelled invitation returns:

```
Invitation is no longer valid.
```

---

# Future APIs

- Resend Invitation
- Bulk Invitation
- Invitation History
- Invitation Analytics
- Invitation Reminder
- Search Invitations 