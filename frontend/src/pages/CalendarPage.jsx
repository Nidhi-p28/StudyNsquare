import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Fetch tasks for the selected date
  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser?._id) return;

  const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];


  fetch(`https://studynsquare.onrender.com/api/tasks/date/${storedUser._id}/${formattedDate}`)
    .then((res) => res.json())
    .then((data) => setTasks(data))
    .catch((err) => console.error("Error fetching tasks:", err));
}, [date]);


  // Redirect to /tasks page
  const handleAddTask = () => {
    navigate("/tasks");
  };

  return (
    <div className="flex flex-col items-center p-2 md:p-6">
      <div className="w-full max-w-5xl">
        <h1 className="mb-6 text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">📅 Study Planner Calendar</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="relative p-4 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden">
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-indigo-200/30 blur-2xl" />
              <Calendar
                onChange={setDate}
                value={date}
                className="w-full rounded-xl overflow-hidden calendar-modern"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="p-4 bg-white dark:bg-gray-800 shadow-xl rounded-2xl h-full">
              <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Tasks on {date.toDateString()}
              </h2>

              {tasks.length > 0 ? (
                <ul className="space-y-3">
                  {tasks.map((task) => (
                    <li key={task._id} className="p-3 border hover:shadow-md transition bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <strong className="text-indigo-600 dark:text-indigo-400">{task.taskName}</strong>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{task.status || "Pending"}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{task.relatedSubject}</p>
                      <p className="text-xs text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-500">No tasks for this date.</p>
              )}

              <div className="mt-4">
                <button onClick={handleAddTask} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700">Add/Manage Tasks</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
