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


  fetch(`http://localhost:5000/api/tasks/date/${storedUser._id}/${formattedDate}`)
    .then((res) => res.json())
    .then((data) => setTasks(data))
    .catch((err) => console.error("Error fetching tasks:", err));
}, [date]);


  // Redirect to /tasks page
  const handleAddTask = () => {
    navigate("/tasks");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-blue-100">
      <h1 className="mb-6 text-3xl font-bold text-blue-700">📅 Study Planner Calendar</h1>

      <div className="p-4 bg-white shadow-lg rounded-xl">
        <Calendar onChange={setDate} value={date} />
      </div>

      <div className="w-full max-w-md mt-6">
        <h2 className="mb-3 text-xl font-semibold text-gray-800">
          Tasks on {date.toDateString()}
        </h2>

        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="p-3 bg-white border border-gray-200 rounded-lg shadow-md"
              >
                <strong className="text-blue-600">{task.taskName}</strong>
<p className="text-gray-600">{task.relatedSubject}</p>
<p className="text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-500">No tasks for this date.</p>
        )}

        <button
          onClick={handleAddTask}
          className="px-5 py-2 mt-6 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          ➕ Add Task
        </button>
      </div>
    </div>
  );
}

export default CalendarPage;
