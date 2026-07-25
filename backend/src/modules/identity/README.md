# Identity Module

This module handles authentication, authorization, user registration, and sessions.

## Business Rules

### Google Authentication
**Google Authentication is never a registration mechanism.**

Google Authentication is an optional authentication provider that may be linked only to an already existing, email-verified KIZUNAFIT account.

- A `LOCAL` account can exist without Google.
- A `GOOGLE` provider cannot exist without a `LOCAL` account.
- The Identity module strictly owns all linking/unlinking logic.
