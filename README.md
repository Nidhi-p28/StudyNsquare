Study Nsquare – **Smart Study Planner**

Study Nsquare is a personalised Smart Study Planner Web Application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).  
It helps students organise their academic life efficiently by tracking and analysing their study routines with the help of scheduling, focus tools, progress tracking, an AI assistant, and motivation boosters — all in one place.
The "Nsquare" represents growth and momentum — the idea that when you organise your time, your learning potential multiplies like a square. 
The purpose of the project is to make studying more structured and data-driven — not just planning, but actually tracking daily progress and visualising it on a dashboard.

🎯 Main Objective:

1. Allowing users to create a personalised study planner by enabling them to log actual study hours, subjects, tasks, and To-dos.

2. Providing insights and visual analysis of their performance using charts and progress tracking.

3. Offering an AI assistant to help with doubts or motivational support.

4. Giving users a clean, minimal dashboard with an AI assistant, focus timer, pomodoro timer, motivational quotes and light/dark mode options, .



Smart-Study-Planner/
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
