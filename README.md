# Fabrice HRMS

A responsive HRMS interface built with React, Tailwind CSS, Vite and a Node.js API.

## Run locally

```sh
npm install
npm run dev
```

Open the Vite URL printed in the terminal for the public landing page, then choose **Open the HRMS** to access the app (`/app.html`). The development server proxies `/api` requests to the Node API on port 3001. Employee and leave-request changes are stored in `data/hrms.json` on the server. Attendance, vacancies and payroll records are stored in the same local file. Some dashboard content remains demonstration data.

Run `npm run build` to build the frontend. The API can also be started separately with `npm run api`.

## Local sign-in demo

Create an account on the welcome screen to sign in. Demo accounts are stored in the current browser's local storage; selecting “Remember me” also keeps the session there. This is a UI prototype, **not secure authentication**: it does not protect the API or provide real access control. Employee and leave data are saved separately by the local Node API.

### Local roles and employee access

The first account created in a browser is an Admin; later accounts are Users. Existing non-admin demo roles are treated as Users. Administrators can add employees, record attendance, manage leave requests and vacancies, inspect departments and positions derived from employees, and download CSV reports. Administrators can also prepare payroll drafts and record payments already made externally.

Users see only their own position, department and attendance report in the interface. An administrator must add their employee record using the **same email address** as their sign-in account. Accounts are browser-local; employee records, attendance, leave and vacancies are saved by the Node API in `data/hrms.json`. Keep `npm run dev` running. Settings and account management are browser-local.

**Important:** These role restrictions are only in the interface. The Node API has no authentication or server-side authorization and exposes all records to anyone with access to it. They are not real access control. Two-factor authentication, secure session management and login-attempt limits are not implemented. Do not use this demo with real employee information or on an untrusted network.

The theme selector in Settings switches between Light (white) and Dark immediately. The choice is saved in this browser and restored when the app is reopened. Other appearance preferences remain demo settings and are not applied across the interface.

### Payroll

In Payroll, add a draft for an employee and pay period, entering base salary, allowances and deductions as whole RWF amounts. Net pay is gross pay minus deductions. Review amounts and calculate any taxes and statutory contributions separately; the app does not calculate them. Export records as CSV if needed.

Pay the worker using your bank, mobile-money provider or another external method. Only after that payment succeeds, choose **Record payment**, enter the payment date and reference, and confirm. This changes the local record to paid; it **does not initiate, verify or reverse a transfer**. Paid records cannot be edited or deleted in the UI. The payroll data is saved in the local JSON file and there is no secure access control or concurrency protection. This prototype is not suitable for real sensitive payroll or multiple administrators without a secure backend, audit trail and verified payment integration.

### Dashboard and search metadata

The dashboard attendance overview groups saved Present, Late and Absent records by day for the current Monday–Sunday week, using the browser's local calendar. Open “View daily counts” for the exact numbers. Days with no recorded attendance are shown as zero; they are not assumed absent.

The public landing page at `/` is rendered as HTML without JavaScript, with descriptive content, feature explanations, FAQs, semantic headings, metadata, a social image and SoftwareApplication structured data. The sign-in app at `/app.html` requests `noindex, nofollow`; dashboard and account titles update in the browser. Robots rules exclude `/api/`, but robots and noindex are not security controls.

For a production build, set the real public HTTPS origin, for example `VITE_SITE_URL=https://your-domain.example npm run build`. The build then adds the canonical URL, absolute social image URL, sitemap and sitemap reference in robots.txt. Without this setting, no domain is guessed and no sitemap is generated. Serve both `dist/index.html` and `dist/app.html`, the assets, and the API on the same origin. Submit the sitemap through your search-engine webmaster tools after deployment. Search rankings and indexing cannot be guaranteed. Protect private data on the server before any deployment.
