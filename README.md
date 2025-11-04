**Smart Study Planner**

The purpose of the project is to make studying more structured and data-driven — not just planning, but actually tracking daily progress and visualising it on a dashboard.

Study Nsquare is a personalised Web Application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).  
The "Nsquare" represents growth and momentum — the idea that when you organise your time, your learning potential multiplies like a square. 


🎯 Main Objective:

1. Allowing users to create a personalised study planner by enabling them to log actual study hours, subjects, tasks, and To-dos.
2. Showing and reminding Daily tasks and current and upcoming deadlines on the dashboard and calendar.
3. Providing insights and visual analysis of their performance using charts and progress tracking.
4. Giving users a clean, minimal dashboard with an AI assistant, focus timer, pomodoro timer, motivational quotes and light/dark mode options.



🧑‍💻 User Features

1. User Authentication (JWT-based Login & Signup)  
  Secure registration and authentication using JSON Web Tokens.

2. Dashboard Overview
  Displays:
  - Today’s Tasks  
  - Upcoming & Active Deadlines  
  - Daily/Weekly Study Progress (Bar Graph)  
  - Task Status (Completed vs Pending vs overdue - Pie Chart)   
  - Daily Motivational Quote Widget  
  - Current Date & Time Display

3. Add Subjects & Tasks
  - Create and manage subjects with goals, daily target hours, and priorities.  
  - Add tasks with deadlines, importance levels.  
  - Automatically sync tasks with planner and calendar.

4. Planner System
  - Plan your week or month with structured goals.  
  - View and edit planner items easily through the dashboard.

5. Focus Tools
  - Focus Timer: Track concentrated study sessions.
  - Pomodoro Timer: Follow 25-5 minute cycles for effective studying.

6. Interactive Calendar
  - Displays all deadlines, upcoming tasks, and study sessions visually.  
  - Click to view or edit scheduled items.

7. Themes
  - Day/Night Mode toggle for comfortable studying at any time.

8. Quick To-Do List**
  - Add quick notes or short-term goals that don’t belong to a subject or task.

9. AI Assistant
  - Smart AI Study Assistant to provide productivity tips, motivation, and time management suggestions.



⚙️ Installation & Setup

1. Clone the Repository
```bash
   git clone 
   cd StudyNsquare
   code .
```

2. Backend Setup
```bash
   cd backend
   npm install
```

3. Create a .env file in /backend:
   PORT=5000
   MONGO_URL=your_mongodb_connection_string

4. Start the backend
```bash
   npm start
```

5. Frontend Setup
```bash
   cd frontend
   npm install
   npm start
```



📁 Project Structure:

StudyNsquare/
│
├── backend/                          # Backend (Node.js + Express + MongoDB)
│   ├── middleware/
│   │   └── authMiddleware.js         # Protects routes using JWT
│   │
│   ├── models/                       # MongoDB Schemas
│   │   ├── StudySession.js           # Schema for study sessions
│   │   ├── Tasks.js                  # Schema for user tasks
│   │   ├── User.js                   # Schema for user accounts
│   │   └── plannerModel.js           # Schema for planner-related data
│   │
│   ├── routes/                       # API Endpoints
│   │   ├── aiRoutes.js               # Routes for AI assistant requests
│   │   ├── authRoutes.js             # Routes for authentication (login/signup)
│   │   ├── plannerRoutes.js          # Routes for planner actions
│   │   ├── sessionRoutes.js          # Routes for study session tracking
│   │   ├── taskRoutes.js             # Routes for task management
│   │   └── test.js                   # Testing route file
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                     # Entry point for backend server
│
├── frontend/                         # Frontend (React + Tailwind CSS)
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/                   # Reusable UI components
│   │   │       ├── AIAssistant.jsx
│   │   │       ├── DeadlineCard.jsx
│   │   │       ├── Layout.jsx
│   │   │       ├── QuoteWidget.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── ThemeToggle.jsx
│   │   │
│   │   ├── pages/                    # Main pages of the web app
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Deadlines.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Planner.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── TestConnection.js
│   │   │   └── Timer.jsx
│   │   │
│   │   ├── App.js                    # Main React component
│   │   ├── App.css                   # Global styles
│   │   ├── App.test.js
│   │   ├── index.js                  # React entry point
│   │   ├── index.css                 # Root styling
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   ├── setupTests.js
│   │   └── tailwind.config.js        # Tailwind CSS configuration
│   │
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── .gitignore
└── README.md                         # Project documentation
