# Fabrice HRMS

A local HRMS prototype built with React, Vite, Express and a local SQLite database. Its role-based interface is inspired by the supplied HR dashboard references.

## Start the local system

Install **Node.js 22.5 or newer** (Node 22 LTS is recommended; `node:sqlite` may print an experimental warning), then run:

```sh
npm install
npm run dev
```

Open the Vite **Local** URL printed in the terminal and choose **Open the HRMS**. The Express API runs on `127.0.0.1:3001`; Vite proxies `/api` on the same origin. Keep both running. The first visit to the app creates the initial system administrator; after that, only an administrator can create accounts under **Users & Roles**. Users sign in with their assigned email and password. Administrators must link each normal employee account to an employee record. Department managers must have an assigned department.

The SQLite database is stored locally at `data/hrms.sqlite` and is ignored by Git. Back up the database while the server is stopped. **Existing browser-only demo accounts are not migrated**; recreate them using the administrator account. The previous `data/hrms.json` file is not modified or deleted, but is not automatically imported into the new database. Keep a backup of it; do not delete it expecting records to have been migrated. Do not commit database files or real employee data.

## Roles and access

The server stores users, roles, permissions, user-role and role-permission relationships in SQLite. It checks the signed-in user's permissions on every API request; frontend menus are not the security boundary. The following roles are seeded:

- **System Administrator:** manages employees, attendance, leave, payroll, recruitment, departments, positions, company settings, user roles and audit logs. Payroll access is enabled by default, as requested.
- **HR Manager:** manages employees, attendance, leave decisions, departments, positions, recruitment and HR reports. No payroll or user administration.
- **Payroll Officer:** views limited employee details and manages payroll and payroll reports. No employee editing or settings.
- **Recruitment Officer:** manages vacancies and candidate status/interview dates, and sees recruitment reports. No employee or payroll access.
- **Department Manager:** sees employees, attendance and leave only in the assigned department; can recommend leave decisions, and see team totals and vacancy/position listings. Cannot approve leave or view payroll.
- **Normal Employee:** sees their linked profile, own attendance, leave, paid payroll records and personal summary; can update their phone and submit leave. They cannot view other employees' records.

Account passwords are hashed with scrypt, and sessions use an HttpOnly, SameSite cookie. An administrator can change another user's role, department, linked employee and active status; changing access invalidates that user's sessions. Users can change their own password in **Account**. Audit entries are available to the administrator. The app uses server-side checks and scoped queries, but remains a **local prototype**, not a security-certified production system. It lacks production-ready deployment, account recovery, durable rate limiting, MFA, comprehensive audit/backup tooling and an external security review. Keep it off untrusted networks and do not use it with real sensitive information until those controls are added. For HTTPS deployments set `HRMS_SECURE_COOKIE=true` and configure a trusted reverse proxy; the development server is not a production deployment.

## Payroll and reports

Payroll records use whole RWF. Salary, allowances and deductions are entered manually; statutory tax and contributions are not calculated. Marking a payroll record paid only records a payment **already made externally**; the system does not send, verify or reverse a bank or mobile-money transfer. Paid records can be viewed by their linked employee. Reports provide scoped summaries, readable records and CSV exports; they are not full statutory or financial reports.

## Scope still to build

The screenshots and requested scenario describe a larger system than this prototype. Candidate applications are entered by staff; public applications, CV uploads and interview invitations are not implemented. Contracts, performance, disciplinary cases, tasks, announcements, real notifications, automatic payslip PDFs, advanced attendance analytics, granular permission editing, IP configuration, automated backups and account recovery are also not implemented. Department and position lists can be created, but full edit/delete workflows are not yet available. Legacy data migration requires a separate reviewed import. Role and department scoping should be independently security-tested before real use.

## SEO and builds

The public landing page is static HTML at `/`; the private application is `/app.html` and requests no indexing. Run `npm run build` to build both. Set `VITE_SITE_URL` to your real public HTTPS origin at build time to generate the canonical URL, social metadata and sitemap. Never treat `robots.txt` or `noindex` as access control. Run automated checks with `node --test tests/*.test.js`.
