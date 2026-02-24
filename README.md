# Decky - Flashcards (Microservices)

---
# User Auth Service
Handles authentication and account management for the platform. It exposes two endpoints under the `/auth` base path.
## Endpoints
### `POST /auth/signup`
Creates a new user account. Returns a **JWT token** on success, which is required to access other services in the architecture.
### `POST /auth/login`
Authenticates an existing user. Returns an informational message about the current status of the account.



## Request Body

Both endpoints share the same request structure:

```json
{
  "username": "your_username",
  "password": "your_password"
}
```
## Responses
| Endpoint  | On Success                                      |
|-----------|-------------------------------------------------|
| `/signup` | JWT token for accessing protected services      |
| `/login`  | Status message about the account                |
<div align="center">
  <sub>Built with <3 by David</sub>
</div>
---