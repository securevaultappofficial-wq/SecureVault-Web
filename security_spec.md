# Security Spec for SecureVault Auth Integration

## 1. Data Invariants
- A user document can only be created at path `/users/{userId}` where `{userId}` is equal to the user's `request.auth.uid`.
- Users can only read and write their own profile document.
- `createdAt` is immutable.
- `userId` is immutable.

## 2. The "Dirty Dozen" Payloads
Here are 12 specific exploit or validation payload scenarios checked against our zero-trust ruleset:

1. **Unauthenticated Read**: Try to read `/users/someUser123` with no auth context. -> Expected: `PERMISSION_DENIED`
2. **Unauthenticated Write**: Try to create `/users/someUser123` with no auth context. -> Expected: `PERMISSION_DENIED`
3. **Identity Spoofing (Write other user)**: Authenticated user `userA` attempts to write `userB`'s document at `/users/userB`. -> Expected: `PERMISSION_DENIED`
4. **Identity Spoofing (Read other user)**: Authenticated user `userA` attempts to read `userB`'s document at `/users/userB`. -> Expected: `PERMISSION_DENIED`
5. **Junk ID Insertion**: Authenticated user attempts to write with an extremely long, unformatted document ID that could bloat queries. -> Expected: `PERMISSION_DENIED`
6. **Missing Required Fields**: Creating without `displayName` or `email`. -> Expected: `PERMISSION_DENIED`
7. **Bypass CreatedAt Timestamp**: Creating user profile with a hardcoded client-side future timestamp instead of `request.time`. -> Expected: `PERMISSION_DENIED`
8. **Bypass LastLoginAt Timestamp**: Updating profile with custom string instead of `request.time`. -> Expected: `PERMISSION_DENIED`
9. **Tampering with Immutable Field `createdAt`**: Updating the profile to modify `createdAt` to a different date. -> Expected: `PERMISSION_DENIED`
10. **Tampering with Immutable Field `userId`**: Updating the profile to modify `userId`. -> Expected: `PERMISSION_DENIED`
11. **Malicious Long String**: Creating a profile containing fields exceeding reasonable size boundaries. -> Expected: `PERMISSION_DENIED`
12. **Foreign Email Spoof**: Authed user attempts to register an email not matching their `request.auth.token.email`. -> Expected: `PERMISSION_DENIED`

## 3. Safe Fortress Firestore Rules Blueprint
The final rules strictly implement these checks inside the matching block.
