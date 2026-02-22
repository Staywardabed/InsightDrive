<div id="top" align="center">
  <h1>INSIGHTDRIVE</h1>
  <p><em>Real-time Ride Feedback Intelligence for Safer Fleet Operations</em></p>

  <img alt="last-commit" src="https://img.shields.io/github/last-commit/Utkarshsingh4147/InsightDrive?style=for-the-badge&logo=git&logoColor=white&color=0ea5e9">
  <img alt="repo-top-language" src="https://img.shields.io/github/languages/top/Utkarshsingh4147/InsightDrive?style=for-the-badge&color=0ea5e9">
  <img alt="repo-language-count" src="https://img.shields.io/github/languages/count/Utkarshsingh4147/InsightDrive?style=for-the-badge&color=0ea5e9">

  <p align="center"><em>Built with the MERN Stack:</em></p>

  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">

  <br>

  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-F04D35?style=for-the-badge&logo=mongoose&logoColor=white">
  <img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
</div>

<hr />

<h2>Table of Contents</h2>
<ul>
  <li><a href="#overview">Overview</a></li>
  <li><a href="#architecture">Architecture</a></li>
  <li><a href="#key-features">Key Features</a></li>
  <li><a href="#tech-stack">Tech Stack</a></li>
  <li><a href="#project-structure">Project Structure</a></li>
  <li><a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#environment-variables">Environment Variables</a></li>
      <li><a href="#run-the-project">Run the Project</a></li>
    </ul>
  </li>
  <li><a href="#api-overview">API Overview</a></li>
  <li><a href="#authentication-and-roles">Authentication and Roles</a></li>
  <li><a href="#real-time-alerts">Real-time Alerts</a></li>
  <li><a href="#scripts">Scripts</a></li>
  <li><a href="#troubleshooting">Troubleshooting</a></li>
  <li><a href="#future-improvements">Future Improvements</a></li>
</ul>

<hr />

<h2 id="overview">Overview</h2>
<p>
  <strong>InsightDrive</strong> is a full-stack fleet feedback platform for transportation teams. It enables commuters to submit structured trip feedback and gives operations admins a live monitoring dashboard with analytics, leaderboard views, and low-score alerts.
</p>
<p>
  The platform is split into:
</p>
<ul>
  <li><strong>Client:</strong> React + Vite single-page app for users and admins.</li>
  <li><strong>Server:</strong> Express + MongoDB API with JWT cookie auth and Socket.IO alerts.</li>
</ul>

<hr />

<h2 id="architecture">Architecture</h2>
<p>
  The project follows a clean, modular MERN setup:
</p>
<ul>
  <li><strong>Presentation Layer (Client):</strong> Route-based pages, reusable UI components, role-protected views, API abstraction through Axios, and toast feedback.</li>
  <li><strong>API Layer (Server):</strong> RESTful routes grouped by domain (`auth`, `rides`, `feedback`, `drivers`, `flags`).</li>
  <li><strong>Domain Layer:</strong> Controllers containing business logic (feedback scoring, admin analytics, ride generation).</li>
  <li><strong>Data Layer:</strong> Mongoose models for users, rides, drivers, feedback, and feature flags.</li>
  <li><strong>Realtime Layer:</strong> Socket.IO emits `low-score-alert` events whenever driver averages drop below threshold.</li>
</ul>

<hr />

<h2 id="key-features">Key Features</h2>
<ul>
  <li><strong>Role-based authentication:</strong> JWT-based cookie auth with separate user/admin access policies.</li>
  <li><strong>User trip workflow:</strong> Generate sample rides and submit multi-section ride feedback.</li>
  <li><strong>Driver performance intelligence:</strong> Auto-updated average ratings and feedback counts per driver.</li>
  <li><strong>Admin analytics dashboard:</strong> Sentiment donut + 30-day trend charts powered by aggregated feedback data.</li>
  <li><strong>Leaderboard and audit views:</strong> Paginated driver leaderboard and complete feedback log with sorting/filter controls.</li>
  <li><strong>Realtime incident alerts:</strong> Live low-score notifications in the admin UI through WebSocket events.</li>
  <li><strong>Feature flags endpoint:</strong> Configurable feedback categories exposed via API.</li>
</ul>

<hr />

<h2 id="tech-stack">Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React 19, React Router, Vite, Tailwind CSS, Recharts, Axios, React Toastify, Socket.IO Client</li>
  <li><strong>Backend:</strong> Node.js, Express, Mongoose, JSON Web Token, Cookie Parser, CORS, Socket.IO</li>
  <li><strong>Database:</strong> MongoDB (Local or Atlas)</li>
  <li><strong>Tooling:</strong> ESLint, npm</li>
</ul>

<hr />

<h2 id="project-structure">Project Structure</h2>
<pre><code>InsightDrive/
|- client/
|  |- src/
|  |  |- api/
|  |  |- components/
|  |  |- context/
|  |  |- pages/
|  |- package.json
|
|- server/
|  |- config/
|  |- controllers/
|  |- middleware/
|  |- models/
|  |- routes/
|  |- server.js
|  |- package.json
|
|- .gitignore
|- README.md
</code></pre>

<hr />

<h2 id="getting-started">Getting Started</h2>

<h3 id="prerequisites">Prerequisites</h3>
<ul>
  <li><strong>Node.js:</strong> v18+ recommended (v16+ minimum).</li>
  <li><strong>npm:</strong> Comes with Node.js.</li>
  <li><strong>MongoDB:</strong> Local instance or MongoDB Atlas URI.</li>
</ul>

<h3 id="installation">Installation</h3>
<ol>
  <li>
    <strong>Clone the repository:</strong>
    <pre><code>git clone https://github.com/Utkarshsingh4147/InsightDrive.git
cd InsightDrive</code></pre>
  </li>
  <li>
    <strong>Install backend dependencies:</strong>
    <pre><code>cd server
npm install</code></pre>
  </li>
  <li>
    <strong>Install frontend dependencies:</strong>
    <pre><code>cd ../client
npm install</code></pre>
  </li>
</ol>

<h3 id="environment-variables">Environment Variables</h3>
<p>Create a <code>.env</code> file inside <code>server/</code>:</p>
<pre><code>PORT=5000
MONGO_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster.mongodb.net/insightdrive
JWT_SECRET=replace_with_long_secure_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
CLIENT_URL=https://insightdrivelpu.vercel.app/

# Reserved admin credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
</code></pre>

<p><strong>Important:</strong> do not commit your real <code>.env</code> file. The root <code>.gitignore</code> already excludes it.</p>
<p>I am providing Admin details for your testing purpose.</p>

<h3 id="run-the-project">Run the Project</h3>
<p>Use two terminals:</p>

<p><strong>Terminal 1 (Backend)</strong></p>
<pre><code>cd server
npm run dev
</code></pre>

<p><strong>Terminal 2 (Frontend)</strong></p>
<pre><code>cd client
npm run dev
</code></pre>

<p>App URLs:</p>
<ul>
  <li><strong>Client:</strong> <code>https://insightdrivelpu.vercel.app/</code></li>
  <li><strong>Server:</strong> <code>https://insightdrive.onrender.com/</code></li>
  <li><strong>Health Check:</strong> <code>GET https://insightdrive.onrender.com/api/health</code></li>
</ul>

<hr />

<h2 id="api-overview">API Overview</h2>
<p>Base URL: <code>https://insightdrive.onrender.com/api</code></p>

<table>
  <thead>
    <tr>
      <th>Module</th>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Access</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Health</td><td>GET</td><td>/health</td><td>Service status check</td><td>Public</td></tr>
    <tr><td>Auth</td><td>POST</td><td>/auth/register</td><td>Create user account</td><td>Public</td></tr>
    <tr><td>Auth</td><td>POST</td><td>/auth/login</td><td>Login user/admin and set JWT cookie</td><td>Public</td></tr>
    <tr><td>Auth</td><td>POST</td><td>/auth/logout</td><td>Clear auth cookie</td><td>Public</td></tr>
    <tr><td>Auth</td><td>GET</td><td>/auth/me</td><td>Get current authenticated profile</td><td>Protected</td></tr>
    <tr><td>Rides</td><td>POST</td><td>/rides/generate</td><td>Create a sample ride for current user</td><td>User</td></tr>
    <tr><td>Rides</td><td>GET</td><td>/rides/mine</td><td>Get current user's rides</td><td>User</td></tr>
    <tr><td>Rides</td><td>GET</td><td>/rides/current</td><td>Get latest active generated ride</td><td>User</td></tr>
    <tr><td>Feedback</td><td>POST</td><td>/feedback</td><td>Submit structured feedback sections</td><td>User</td></tr>
    <tr><td>Feedback</td><td>GET</td><td>/feedback/mine</td><td>Get feedback submitted by current user</td><td>User</td></tr>
    <tr><td>Feedback</td><td>GET</td><td>/feedback/all</td><td>Paginated feedback feed with sorting</td><td>Admin</td></tr>
    <tr><td>Feedback</td><td>GET</td><td>/feedback/users</td><td>Users who submitted feedback</td><td>Admin</td></tr>
    <tr><td>Feedback</td><td>GET</td><td>/feedback/analytics</td><td>Sentiment and trend analytics</td><td>Admin</td></tr>
    <tr><td>Drivers</td><td>GET</td><td>/drivers</td><td>Paginated drivers list sorted by rating</td><td>Protected</td></tr>
    <tr><td>Drivers</td><td>POST</td><td>/drivers</td><td>Create new driver profile</td><td>Protected</td></tr>
    <tr><td>Flags</td><td>GET</td><td>/flags</td><td>Get (or seed) feature flags</td><td>Public</td></tr>
  </tbody>
</table>

<hr />

<h2 id="authentication-and-roles">Authentication and Roles</h2>
<ul>
  <li><strong>User role:</strong> Registers normally and can generate rides + submit feedback.</li>
  <li><strong>Admin role:</strong> Logs in using <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> from environment variables.</li>
  <li><strong>JWT storage:</strong> Token is stored in an HTTP-only cookie named <code>token</code>.</li>
  <li><strong>Cookie security:</strong> <code>secure</code> mode is automatically enabled in production via <code>NODE_ENV=production</code>.</li>
</ul>

<hr />

<h2 id="real-time-alerts">Real-time Alerts</h2>
<p>
  The server emits a Socket.IO event named <code>low-score-alert</code> whenever a driver's average rating drops below <strong>2.5</strong>. Admin clients subscribe to this channel and render incoming alerts in the dashboard.
</p>

<hr />

<h2 id="scripts">Scripts</h2>
<p><strong>Server (<code>server/package.json</code>)</strong></p>
<pre><code>npm run dev    # nodemon server.js
npm start      # node server.js
</code></pre>

<p><strong>Client (<code>client/package.json</code>)</strong></p>
<pre><code>npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview built app
npm run lint     # run ESLint
</code></pre>

<hr />

<h2 id="troubleshooting">Troubleshooting</h2>
<ul>
  <li><strong>Mongo connection fails:</strong> verify <code>MONGO_URI</code> and whitelist your IP if using Atlas.</li>
  <li><strong>401 Not authorized:</strong> clear cookies and re-login; confirm <code>JWT_SECRET</code> is set.</li>
  <li><strong>CORS errors:</strong> ensure <code>CLIENT_URL</code> exactly matches your frontend origin.</li>
  <li><strong>Admin login fails:</strong> confirm <code>ADMIN_EMAIL</code>/<code>ADMIN_PASSWORD</code> are present in <code>server/.env</code>.</li>
  <li><strong>No live alerts visible:</strong> verify backend is running and admin page is open with active socket connection.</li>
</ul>

<hr />

<h2 id="future-improvements">Future Improvements</h2>
<ul>
  <li>Add automated tests (unit + integration + API contract tests).</li>
  <li>Introduce refresh tokens and stricter session management.</li>
  <li>Add rate limiting and request validation middleware.</li>
  <li>Implement CI pipeline (lint/build/test) and deployment workflows.</li>
  <li>Add role-specific audit logs for admin actions.</li>
</ul>

<hr />

<div align="left">
  <a href="#top">Return to Top</a>
</div>
