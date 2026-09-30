# Firestore Security Specification & Invariants

## 1. Data Invariants
1. **Multi-Tenancy & Isolation**: Every entity (user, client, project, task, invoice, payment) MUST have a valid `orgId`. Under no circumstances can a user or manager of Agency A read or mutate documents belonging to Agency B.
2. **Identity Integrity**: In all create operations requiring authorship or membership, the author ID must match `request.auth.uid`.
3. **No Unauthenticated Access**: Unauthenticated requests are completely rejected across all collections.
4. **Master Gate Enforcement**: Access to tasks and deliverables is governed by agency membership and project ownership.
5. **No Spoofed Roles**: A user cannot escalate their role to `admin` without verified administrative privileges.
6. **Immutable Key Safeguards**: Document `id`, `orgId`, and `createdAt` cannot be altered once created.

## 2. The "Dirty Dozen" Payloads
1. **Cross-Tenant Task Injection**: Attempting to create a task in Agency B with an Agency A credential -> `PERMISSION_DENIED`.
2. **Ghost Field Poisoning**: Inserting unexpected fields (e.g. `isAdmin: true` or `bypassReview: true`) into user or agency documents -> `PERMISSION_DENIED`.
3. **Huge ID Buffer Attack**: Document ID greater than 128 characters or containing illegal characters -> `PERMISSION_DENIED`.
4. **Owner ID Spoofing**: Setting `ownerId` of an Agency to another user's UID -> `PERMISSION_DENIED`.
5. **Privilege Escalation on User Creation**: An employee setting their own role to `admin` upon registration -> `PERMISSION_DENIED`.
6. **Task Status Skip**: Bypassing workflow stages without permissions -> `PERMISSION_DENIED`.
7. **Negative Budget Project**: Creating a project with negative budget values -> `PERMISSION_DENIED`.
8. **Orphaned Task Record**: Creating a task pointing to a non-existent `orgId` -> `PERMISSION_DENIED`.
9. **Tampered Creation Timestamp**: Overriding `createdAt` with arbitrary past dates -> `PERMISSION_DENIED`.
10. **Invoice Amount Modification Post-Payment**: Changing invoice total after completion -> `PERMISSION_DENIED`.
11. **Client Account Hijacking**: Overriding client contact information without manager/admin role -> `PERMISSION_DENIED`.
12. **Blanket Query Scraping**: Attempting an unrestricted `collectionGroup('tasks')` read without tenant filters -> `PERMISSION_DENIED`.

## 3. Test Runner
Defined in security validation suites ensuring all 12 dirty payloads return `PERMISSION_DENIED`.
