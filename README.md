CampusHire - Full-Stack Placement Management Portal
CampusHire is a full-stack MERN placement management portal engineered to streamline campus recruitment drives, student job applications, interview scheduling, and placement analytics.

🚀 Key Features
Role-Based Access Control (RBAC): Dedicated workflows and dashboards for Students and Placement Cell Administrators.

Job & Drive Management: Admins can publish, update, and manage job listings with eligibility criteria.

Application Tracker: Students can browse openings, apply with uploaded resumes, and track recruitment progress in real time.

Interview Scheduler: Built-in interview management module to schedule and organize candidate rounds.

Placement Analytics: Visual reporting and insights on application trends, selection rates, and drive performance.

Automated Notifications: Email alerts and notifications for application status updates and interview calls.

🛠 Tech Stack
Frontend: React.js, Vite, React Router, Axios, CSS3

Backend: Node.js, Express.js, JWT Authentication, Multer, Nodemailer

Database: MongoDB Atlas, Mongoose ODM

📁 Repository Structure
Plaintext
campus-placement-portal/
├── backend/            # Express.js REST API server & database models
└── frontend/           # React + Vite client interface
⚙️ Local Setup & Installation
1. Clone the Repository

Bash
git clone https://github.com/rajukumar1719/campus-placement-portal.git
cd campus-placement-portal
2. Backend Setup

Bash
cd backend
npm install
npm run dev
Create a .env file in the backend/ directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
3. Frontend Setup

Bash
cd ../frontend
npm install
npm run dev
The application will be accessible at `
