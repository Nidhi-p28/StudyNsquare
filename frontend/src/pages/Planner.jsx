// frontend/src/pages/Planner.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Planner = () => {
  const [planner, setPlanner] = useState([]);
  const [filter, setFilter] = useState({ date: "", priority: "" });
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    subject: "",
    targetHours: "",
    priority: "Medium",
    dailyGoal: false,
    startDate: "",
    endDate: "",
    date: "",
    notes: "",
  });

  // NEW: sessions for the user (all sessions or filtered)
  const [sessions, setSessions] = useState([]);

  // For toggling the inline "log hours" area per planner item
  const [showLogFor, setShowLogFor] = useState(null);
  const [logData, setLogData] = useState({ date: "", hours: "", notes: "" });

  // Get userId from stored user
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const userId = storedUser ? storedUser._id : localStorage.getItem("userId");

  // Fetch planner entries
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/planner/${userId}`)
      .then((res) => setPlanner(res.data || []))
      .catch((err) => console.error("Error fetching planner:", err));
  }, [userId]);

  // Fetch study sessions for user (last 30 days or all)
  const fetchSessions = async () => {
    if (!userId) return;
    try {
      // optional: restrict range with ?start=&end=
      const res = await axios.get(`http://localhost:5000/api/sessions/user/${userId}`);
      setSessions(res.data || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  // Handle form change (planner)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Add/Edit planner
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User not found — please log in again.");
      return;
    }

    try {
      const dataToSend = { ...formData, userId };

      if (editingId) {
        const res = await axios.put(
          `http://localhost:5000/api/planner/${editingId}`,
          dataToSend
        );
        setPlanner(planner.map((p) => (p._id === editingId ? res.data : p)));
        setEditingId(null);
        alert("✏️ Planner updated successfully!");
      } else {
        const res = await axios.post("http://localhost:5000/api/planner", dataToSend);
        setPlanner([...planner, res.data]);
        alert("📅 Planner entry added!");
      }

      setFormData({
        subject: "",
        targetHours: "",
        priority: "Medium",
        dailyGoal: false,
        startDate: "",
        endDate: "",
        date: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error saving planner entry:", err);
      alert("Error saving planner entry! Check console for details.");
    }
  };

  // Edit entry
  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setFormData({
      subject: plan.subject,
      targetHours: plan.targetHours,
      priority: plan.priority,
      dailyGoal: plan.dailyGoal,
      startDate: plan.startDate || "",
      endDate: plan.endDate || "",
      date: plan.date?.split("T")[0] || "",
      notes: plan.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/planner/${id}`);
      setPlanner(planner.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting planner:", err);
      alert("Error deleting planner entry!");
    }
  };

  // Filter logic
  const filteredPlanner = planner.filter((plan) => {
    const matchDate = filter.date ? plan.date?.split("T")[0] === filter.date : true;
    const matchPriority = filter.priority ? plan.priority === filter.priority : true;
    return matchDate && matchPriority;
  });

  // Helper: sum hours done for a planner entry (all sessions tied to planner._id)
  const hoursDoneForPlanner = (plannerId) => {
    const related = sessions.filter((s) => s.plannerId && s.plannerId.toString() === plannerId.toString());
    return related.reduce((acc, s) => acc + (Number(s.hours) || 0), 0);
  };

  // Toggle log UI and initialize default logData
  const openLogUI = (plan) => {
    setShowLogFor(plan._id);
    const todayISO = new Date().toISOString().split("T")[0];
    setLogData({ date: todayISO, hours: "", notes: "" });
  };

  const closeLogUI = () => {
    setShowLogFor(null);
    setLogData({ date: "", hours: "", notes: "" });
  };

  // Submit a study session
  const submitLog = async (plannerId) => {
    if (!userId) return alert("Please login again.");
    if (!logData.date || logData.hours === "") return alert("Enter date and hours.");

    try {
      const payload = {
        userId,
        plannerId,
        date: logData.date,
        hours: Number(logData.hours),
        notes: logData.notes || "",
      };
      await axios.post("http://localhost:5000/api/sessions", payload);
      alert("✅ Logged study hours!");
      closeLogUI();
      // refresh sessions so UI updates
      fetchSessions();
    } catch (err) {
      console.error("Error logging hours:", err);
      alert("Error logging hours. See console.");
    }
  };

  return (
    <div className="max-w-5xl p-6 mx-auto mt-8 rounded-lg shadow-md bg-gray-50">
      <h1 className="mb-4 text-3xl font-bold text-center text-indigo-600">
        🧩 Create Study Planner
      </h1>

      {/* ---- Planner Form ---- */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
        {/* subject, targetHours, priority, dailyGoal, date/start/end, notes */}
        <div>
          <label className="block mb-1 font-medium">Subject</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                 placeholder="e.g. Physics / DSA" className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Target Hours</label>
          <input type="number" name="targetHours" value={formData.targetHours} onChange={handleChange}
                 placeholder="e.g. 3" className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="flex items-center mt-6">
          <input type="checkbox" name="dailyGoal" checked={formData.dailyGoal} onChange={handleChange} className="mr-2" />
          <label>Daily Goal</label>
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        {formData.dailyGoal && (
          <>
            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </>
        )}

        <div className="col-span-2">
          <label className="block mb-1 font-medium">Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Write notes or description..." className="w-full p-2 border rounded" rows="3" />
        </div>

        <button type="submit" className="col-span-2 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">
          {editingId ? "Update Planner Entry" : "Add Subject to Planner"}
        </button>
      </form>

      {/* ---- Filters ---- */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Filter by Date</label>
          <input type="date" name="date" value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })} className="p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Filter by Priority</label>
          <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })} className="p-2 border rounded">
            <option value="">All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <button onClick={() => setFilter({ date: "", priority: "" })} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Clear Filters
        </button>
      </div>

      {/* ---- Planner List ---- */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-700">📘 Your Plans</h2>

      {filteredPlanner.length === 0 ? (
        <p className="text-gray-500">No matching entries.</p>
      ) : (
        <div className="space-y-4">
          {filteredPlanner.map((plan) => {
            const hoursDone = hoursDoneForPlanner(plan._id);
            return (
              <div key={plan._id} className="relative p-4 transition bg-white border rounded shadow-sm hover:shadow-md">
                <div className="absolute flex gap-3 top-2 right-2">
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEdit(plan)} />
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(plan._id)} />
                </div>

                <h3 className="text-xl font-semibold">{plan.subject}</h3>
                <p>🎯 Target Hours (per day): {plan.targetHours}</p>
                <p>🔥 Priority: {plan.priority}</p>
                <p>📅 Date: {plan.date ? new Date(plan.date).toLocaleDateString() : "-"}</p>
                {plan.dailyGoal && (
                  <p>🗓️ Daily Goal: {new Date(plan.startDate).toLocaleDateString()} → {new Date(plan.endDate).toLocaleDateString()}</p>
                )}
                {plan.notes && <p>📝 Notes: {plan.notes}</p>}

                <div className="flex items-center justify-between gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Hours done so far: <strong>{hoursDone} hrs</strong></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => openLogUI(plan)} className="px-3 py-1 text-white bg-blue-600 rounded">Log Hours</button>
                  </div>
                </div>

                {/* Inline log UI */}
                {showLogFor === plan._id && (
                  <div className="p-3 mt-3 border rounded bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm">Date:</label>
                      <input type="date" value={logData.date} onChange={(e) => setLogData({ ...logData, date: e.target.value })} className="p-1 border rounded" />
                      <label className="text-sm">Hours:</label>
                      <input type="number" min="0" step="0.25" value={logData.hours} onChange={(e) => setLogData({ ...logData, hours: e.target.value })} className="w-20 p-1 border rounded" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <textarea placeholder="Notes (optional)" value={logData.notes} onChange={(e) => setLogData({ ...logData, notes: e.target.value })} className="w-full p-2 border rounded" rows="2" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => submitLog(plan._id)} className="px-3 py-1 text-white bg-green-600 rounded">Save</button>
                      <button onClick={closeLogUI} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Planner;
