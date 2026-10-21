# Campus Find

Campus Find is a privacy-first campus lost-item reporting and query portal.

## Monorepo Architecture

- `frontend/` — React.js Public Portal (Sujith)
- `backend/` — Core Express REST APIs 
- `admin/` — Admin Dashboard & API

## Core Privacy Constraint

Campus Find is **not** a public marketplace or lost-and-found listing board. There are:
- NO public lost-item listing pages
- NO public browsing or filtering of reports
- NO public access to other users' reports
- NO direct user-to-user messaging

Public users only submit lost reports (`/report-lost`) or found item queries (`/report-found`) and receive confirmation screen responses (`/success`). Administrative matching is performed privately by authenticated campus administrators.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
