# Fabrice HRMS

A responsive HRMS interface built with React, Tailwind CSS, Vite and a Node.js API.

## Run locally

```sh
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The development server proxies `/api` requests to the Node API on port 3001. Employee and leave-request changes are stored in `data/hrms.json` on the server. Other screens currently use demonstration data and actions.

Run `npm run build` to build the frontend. The API can also be started separately with `npm run api`.

## Local sign-in demo

Create an account on the welcome screen to sign in. Demo accounts are stored in the current browser's local storage; selecting “Remember me” also keeps the session there. This is a UI prototype, **not secure authentication**: it does not protect the API or provide real access control. Employee and leave data are saved separately by the local Node API.

### Local roles and employee access

The first account created in a browser is an Admin; later accounts are Users. Existing non-admin demo roles are treated as Users. Administrators can add employees, record attendance, manage leave requests and vacancies, inspect departments and positions derived from employees, and download CSV reports. Payroll is not implemented.

Users see only their own position, department and attendance report in the interface. An administrator must add their employee record using the **same email address** as their sign-in account. Accounts are browser-local; employee records, attendance, leave and vacancies are saved by the Node API in `data/hrms.json`. Keep `npm run dev` running. Settings and account management are browser-local.

**Important:** These role restrictions are only in the interface. The Node API has no authentication or server-side authorization and exposes all records to anyone with access to it. They are not real access control. Two-factor authentication, secure session management and login-attempt limits are not implemented. Do not use this demo with real employee information or on an untrusted network.
