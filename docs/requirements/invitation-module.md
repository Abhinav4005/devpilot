# Invitation Module - Requirement Analysis

## Objective

The Invitation module allows Workspace Owners and Admins to invite existing users to join a workspace securely using their email address.

---

# Actors

| Role | Permission |
|------|------------|
| OWNER | Can send, cancel invitations |
| ADMIN | Can send, cancel invitations |
| MEMBER | No invitation permissions |

---

# Invitation Flow

```
Owner/Admin
      │
      ▼
Invite User by Email
      │
      ▼
Validate Business Rules
      │
      ▼
Create Invitation
      │
      ▼
Generate Invitation Token
      │
      ▼
Set Expiry (7 Days)
      │
      ▼
Send Invitation Email
```

---

# Invitation Acceptance Flow

```
User Opens Invitation Link
            │
            ▼
Validate Token
            │
            ▼
Validate Invitation
            │
            ▼
Validate Workspace
            │
            ▼
Create Workspace Member
            │
            ▼
Update Invitation Status
            │
            ▼
Return Success
```

---

# Business Rules

## Workspace

- Workspace must exist.
- Workspace must not be archived.

---

## Inviter

Only the following roles can send invitations:

- OWNER
- ADMIN

Members cannot invite users.

---

## Invitee

- Invite is sent using email.
- User account must already exist.
- User must not already be a member of the workspace.

---

## Duplicate Invitations

Only one **PENDING** invitation is allowed per email per workspace.

Example:

```
Workspace A

abhi@gmail.com

PENDING
```

Sending another invitation should return:

```
409 Conflict

Pending invitation already exists.
```

Rejected, Accepted or Expired invitations can be re-created.

---

## Invitation Validity

Invitation remains valid for **7 days**.

After expiry:

- Invitation cannot be accepted.
- Invitation status becomes EXPIRED.

---

## Invitation Acceptance

Only the invited user can accept the invitation.

Validation:

```
Invitation Email
        │
        ▼
Logged In User Email
        │
        ▼
Must Match
```

Otherwise:

```
403 Forbidden
```

---

## Successful Acceptance

After accepting:

- Create WorkspaceMember
- Status → ACCEPTED
- acceptedAt → Current Time
- Invitation token becomes unusable

---

## Rejection

After rejection:

- Status → REJECTED
- rejectedAt → Current Time
- Invitation token becomes unusable

---

## Cancellation

Owner/Admin can cancel an invitation.

Cancelled invitations cannot be reused.

Users should receive:

```
Invitation is no longer valid.
```

---

## Workspace Deleted

If the workspace no longer exists:

- Invitation cannot be accepted.
- Invitation becomes EXPIRED.

---

## Archived Workspace

Users cannot accept invitations for archived workspaces.

Response:

```
Workspace is archived.
```

---

## Already Joined

If the invited user joins the workspace through another valid flow before accepting:

- Pending invitation becomes EXPIRED.

---

# Invitation Status Lifecycle

```
                +-----------+
                | PENDING   |
                +-----------+
                 /    |    \
                /     |     \
         Accept  Reject  Expire
            |       |       |
            ▼       ▼       ▼
     +-----------+ +-----------+ +-----------+
     | ACCEPTED | | REJECTED | | EXPIRED  |
     +-----------+ +-----------+ +-----------+
```

---

# Security Requirements

- Only authenticated users can accept invitations.
- Logged-in user's email must match the invitation email.
- Invitation token must be one-time usable.
- Expired invitations cannot be reused.
- Cancelled invitations cannot be reused.
- Accepted invitations cannot be reused.
- Rejected invitations cannot be reused.

---

# Future Enhancements

- Email notification service
- Invitation reminder emails
- Invitation audit logs
- Activity timeline
- Resend invitation
- Invitation analytics
- Bulk invitations