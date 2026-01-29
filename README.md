# Pastebin-Lite

Pastebin-Lite is a simple web application that allows users to create text pastes and share them using a unique URL.  
Each paste can optionally expire after a certain time (TTL) or after a limited number of views.

This project is built as part of a take-home assignment and is designed to work reliably in a serverless environment.

---

## Live Demo

Deployed URL:  
https://pastebin3600.vercel.app/
---

## Features

- Create a paste with arbitrary text
- Generate a shareable link for each paste
- View pastes via API or browser
- Optional constraints:
  - Time-based expiry (TTL)
  - Maximum view count
- Safe rendering of paste content
- Deterministic time support for automated testing

---

## Tech Stack

- Framework: Node.js / Next.js
- Database: MongoDB
- Deployment: Vercel

---

## Persistence Layer

This project uses **MongoDB** as the persistence layer.

MongoDB was chosen because:
- It persists data across serverless requests
- It supports flexible schemas for optional fields (TTL, max views)
- It works well with managed cloud services like MongoDB Atlas

Each paste is stored with:
- Content
- Creation timestamp
- Optional expiration timestamp
- Optional maximum views
- Current view count

No manual database migrations or shell access are required at runtime.

---

## Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pastebin-lite.git
cd pastebin-lite
```

### 2. Install dependencies
```bash
npm install
```

3. Set environment variables

Create a .env.local file in the project root:```bash
MONGODB_URI=your_mongodb_connection_string



### 4. Start the development server
```bash
npm run dev
```

### 5. Access the application
Open your browser and navigate to `http://localhost:your_port` to access the application.

---

## API Endpoints

Health Check
GET /api/healthz

Create a Paste
POST /api/pastes


Fetch a Paste (API)
GET /api/pastes/:id


View a Paste (HTML)
GET /p/:id


## Important Design Decisions

- MongoDB is used to ensure data persistence across serverless requests
- No in-memory global state is used to maintain serverless compatibility
- Atomic database updates prevent race conditions on view limits
- TTL and view-count constraints are enforced strictly
- Paste content is rendered safely to prevent script execution
- Deterministic time testing is supported using request headers when `TEST_MODE=1`
