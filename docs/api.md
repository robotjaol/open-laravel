# API (v1)

Base path `/api/v1`. Specification: [openapi.yaml](openapi.yaml). Interactive endpoint list in the app: **API overview** page.

## Authentication
```bash
curl -s -X POST $BASE/api/v1/auth/token -H 'Accept: application/json' \
  -d email=you@example.com -d password=... -d device_name=cli
# {"data":{"token":"...","token_type":"Bearer"}}
curl -s $BASE/api/v1/me -H "Authorization: Bearer $TOKEN" -H 'Accept: application/json'
```
Send `Accept: application/json`.

## Conventions
- Success: `{"data": ...}`; collections add `links` and `meta` (Laravel pagination).
- Errors: `{"message": "...", "code": "...", "errors": {...}?}`.

| Status | code | Meaning |
|---|---|---|
| 401 | `unauthenticated` | Missing or invalid token |
| 403 | `forbidden` / `account_inactive` | Not permitted / account deactivated |
| 404 | `not_found` | Unknown resource |
| 422 | `validation_failed` / `business_rule_violation` | Invalid input / rule broken |
| 429 | `too_many_requests` | Rate limited (60/min per user or IP; 5/min on token endpoint) |

- Collections accept `search`, `sort`, `direction`, `per_page` (10, 25, 50, 100) and `filter[status]`.
- Versioning: breaking changes ship under a new prefix (`/api/v2`); `v1` stays until announced deprecated.

## Endpoints
| Method | Path | Permission |
|---|---|---|
| POST | `/auth/token` | public, throttled |
| DELETE | `/auth/token` | authenticated |
| GET | `/me` | authenticated |
| GET/POST | `/projects` | `projects.view` / `projects.create` |
| GET/PUT/DELETE | `/projects/{id}` | `projects.view` / `update` / `delete` |
