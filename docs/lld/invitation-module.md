# Invitation Module - Low Level Design (LLD)

## Overview

The Invitation module is responsible for securely inviting existing users to join a workspace.

This document defines the responsibilities of each layer, dependency flow, business flow, SOLID principles, and transaction boundaries before implementation.

---

# Module Responsibilities

```
Client
    │
    ▼
Invitation Controller
    │
    ▼
Invitation Service
    │
    ▼
Repositories
    │
    ▼
MongoDB
```

---

# Layer Responsibilities

## Invitation Controller

### Responsibility

- Receive HTTP Request
- Validate Request (handled by middleware)
- Call Service Layer
- Return Standard API Response

### Should NOT

- Access Database
- Write Business Logic
- Perform Authorization Logic
- Generate Tokens

---

## Invitation Service

### Responsibility

Contains all business rules.

### createInvitation()

Responsibilities

- Validate workspace exists
- Validate workspace is active
- Validate inviter permission (OWNER / ADMIN)
- Validate invited user exists
- Validate invited user is not already a workspace member
- Validate no pending invitation exists
- Generate invitation token
- Create invitation
- Trigger email service
- Return response DTO

---

### acceptInvitation()

Responsibilities

- Validate invitation token
- Validate invitation exists
- Validate invitation is not expired
- Validate invitation status is PENDING
- Validate logged-in user's email matches invitation email
- Validate workspace exists
- Validate workspace is active
- Start Transaction
- Create WorkspaceMember
- Update invitation status to ACCEPTED
- Set acceptedAt timestamp
- Invalidate invitation token
- Commit Transaction
- Return response

---

### rejectInvitation()

Responsibilities

- Validate invitation token
- Validate invitation exists
- Validate invitation status is PENDING
- Update status to REJECTED
- Set rejectedAt timestamp
- Invalidate token
- Return response

---

### cancelInvitation()

Responsibilities

- Validate inviter permission
- Validate invitation exists
- Validate invitation status is PENDING
- Update status to CANCELLED
- Invalidate token
- Return response

---

# Repository Responsibilities

Repositories are responsible only for database interaction.

No business logic should exist inside repositories.

## Methods

### InvitationRepository

```
create()

findById()

findByToken()

findPendingInvitation()

findWorkspaceInvitations()

update()

updateStatus()

deleteExpired()
```

### WorkspaceRepository

```
findById()
```

### WorkspaceMemberRepository

```
findMember()

create()
```

### UserRepository

```
findByEmail()

findById()
```

---

# Dependency Graph

```
InvitationController
        │
        ▼
InvitationService
        │
        ├──────────────► WorkspaceRepository
        │
        ├──────────────► UserRepository
        │
        ├──────────────► WorkspaceMemberRepository
        │
        ├──────────────► InvitationRepository
        │
        └──────────────► EmailService
```

Repositories must never call other repositories.

Controllers must never call repositories directly.

---

# Sequence Diagram

## Create Invitation

```
Client

│

▼

Controller

│

▼

InvitationService

│

├────────► WorkspaceRepository

│

├────────► UserRepository

│

├────────► WorkspaceMemberRepository

│

├────────► InvitationRepository

│

└────────► EmailService

│

▼

Response
```

---

## Accept Invitation

```
Client

│

▼

Controller

│

▼

InvitationService

│

├────────► InvitationRepository

│

├────────► WorkspaceRepository

│

├────────► WorkspaceMemberRepository

│

└────────► Transaction

        │

        ├──── Create WorkspaceMember

        └──── Update Invitation

│

▼

Commit

│

▼

Response
```

---

# Transaction Boundary

Transaction is required only during invitation acceptance.

Reason:

Both operations must succeed together.

```
Create WorkspaceMember

AND

Update Invitation Status
```

If either operation fails:

```
Rollback Transaction
```

No partial data should be stored.

---

# SOLID Principles

## Single Responsibility Principle (SRP)

Controller

- HTTP Layer only

Service

- Business Logic only

Repository

- Database only

Mapper

- Response Transformation only

Validation

- Request Validation only

---

## Open Closed Principle (OCP)

InvitationService should be extendable.

Example

```
Future

↓

Slack Invitation

↓

SMS Invitation

↓

Bulk Invitation
```

No modification should be required in existing logic.

---

## Dependency Rule

Flow must always be:

```
Controller

↓

Service

↓

Repository

↓

MongoDB
```

Never:

```
Controller

↓

Repository
```

Never:

```
Repository

↓

Repository
```

---

# Error Handling Strategy

Return business errors using AppError.

Examples

```
Workspace not found

Workspace archived

User already member

Pending invitation already exists

Invitation expired

Invitation no longer valid

Unauthorized invitation access
```

---

# Security Considerations

- Only OWNER or ADMIN can invite users.
- Only invited user can accept invitation.
- Invitation token must be one-time usable.
- Expired invitations cannot be reused.
- Accepted invitations cannot be reused.
- Rejected invitations cannot be reused.
- Cancelled invitations cannot be reused.

---

# Future Enhancements

- Bulk Invitations
- Resend Invitation
- Email Queue
- Activity Logs
- Notification Service
- Audit Trail
- Invitation Analytics
- Invitation Reminder Emails

---

# Definition of Done

- Requirement Analysis Completed
- Database Design Completed
- LLD Completed
- API Design Completed
- Implementation Completed
- Unit Tests Passed
- Integration Tests Passed
- Security Review Completed
- Performance Review Completed
- Scalability Review Completed
- Documentation Updated