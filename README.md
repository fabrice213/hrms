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

### Settings and demo roles

The Settings screen lets users save company details, a logo and preferences in browser storage, and change their local password. The first account created in a browser is an Admin; later self-registered accounts default to IT Support. Admins can add, edit, deactivate and remove local users and assign Admin, HR Officer, Manager, Accountant or IT Support roles. The sidebar reflects each role's demo page access. Inactive accounts cannot sign in. Preferences are saved but are not yet applied throughout the interface.

These restrictions and password hashes are client-side demonstrations only. They do not secure the Node API or provide server-side authorization, two-factor authentication, session expiry, or login-attempt limits. Do not use this prototype with real employee information.
