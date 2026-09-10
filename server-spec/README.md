# ESLGSC API — Server Contracts

This document and the `openapi.yaml` file define the backend endpoints required by the current frontend.

## What’s here
- OpenAPI 3.0 spec at `server-spec/openapi.yaml`
- Endpoints grouped by feature (Auth, Employees, Employee Edits & Audit, News, Uploads, LGAs, Announcements, Retirement Alerts, Activity Log, Dashboard)
- JWT Bearer security with roles: SUPER, ADMIN, MEDIA, AUDIT, LGA

## Suggested role access
- Public: `GET /announcements`
- LGA: `GET /employees/my-lga`, `POST /uploads`, `GET /uploads/my-lga`
- MEDIA: `GET/POST/PUT /news`, `POST /news/{id}/submit`
- AUDIT: `POST /employee-edits`, `GET /employee-edits?submittedById=me`
- SUPER/ADMIN: Full CRUD on employees, LGAs, approve/reject via audit queue, list all uploads, manage announcements, activity log

## Pagination & responses
- Lists return `{ data: [...], meta: { page, pageSize, total } }` where applicable
- Errors return `{ message, code, details? }`

## Uploads
- `POST /uploads` expects `multipart/form-data` with fields: `file` (binary) and `title` (string)
- Files served from `/uploads/{filename}` (static). Frontend builds file links using `VITE_API_BASE_URL`.

## Auth
- `POST /auth/login` returns `{ token, user }`. The frontend stores the token and sends `Authorization: Bearer <token>`.

## Next steps
- Choose backend runtime (Next.js API routes vs separate Node/Express/Nest/Django). The spec is server-agnostic.
- Implement endpoints progressively, swapping the current mock `dataService` calls to real API calls.
- Add CORS, rate limiting, logging, and request validation (zod/joi) as needed.

