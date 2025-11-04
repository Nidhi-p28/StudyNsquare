// src/pages/Dashboard.jsx
/*import React from "react";
import Sidebar from "../components/Sidebar";
import QuoteWidget from "../components/QuoteWidget";

export default function Dashboard() {
  const deadlines = [
    { task: "Math Assignment", due: "2025-11-05" },
    { task: "AI Project", due: "2025-11-08" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-screen p-8 ml-64 bg-gray-50">
        <h1 className="mb-4 text-3xl font-bold">Welcome back 👋</h1>
        <QuoteWidget />
        <div className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">📅 Upcoming Deadlines</h2>
          <div className="grid grid-cols-2 gap-4">
            {deadlines.map((d, i) => (
              <div key={i} className="p-4 bg-white shadow rounded-xl">
                <h3 className="font-bold">{d.task}</h3>
                <p className="text-gray-600">Due: {d.due}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}*/
// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import QuoteWidget from "../components/QuoteWidget";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F97316"]; // primary, completed, overdue

export default function Dashboard() {
  const [now, setNow] = useState(new Date());
  const [todayTasks, setTodayTasks] = useState([]); // tasks with deadline today
  const [todayPlanners, setTodayPlanners] = useState([]); // planners for today
  const [allTasks, setAllTasks] = useState([]); // for weekly stats maybe
  const [allPlanners, setAllPlanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);

  // user from localStorage (you already store 'user' on login)
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const userId = storedUser ? storedUser._id : null;

  // Live time update
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Helper: date string yyyy-mm-dd
  const toDateKey = (d) => {
    const dt = new Date(d);
    const tzOffset = dt.getTimezoneOffset() * 60000;
    const local = new Date(dt.getTime() - tzOffset);
    return local.toISOString().split("T")[0];
  };

  // Fetch all data (today tasks, today planners, all tasks/planners)
  const fetchAll = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const todayKey = toDateKey(now);

      // 1) tasks with deadline exactly today
      const tasksRes = await axios.get(
        `http://localhost:5000/api/tasks/date/${userId}/${todayKey}`
      );

      // 2) planners for today (either date or dailyGoal ranges)
      const plannersRes = await axios.get(
        `http://localhost:5000/api/planner/date/${userId}/${todayKey}`
      );

      // 3) all tasks (for weekly analytics)
      const allTasksRes = await axios.get(
        `http://localhost:5000/api/tasks/${userId}`
      );

      // 4) all planners
      const allPlannersRes = await axios.get(
        `http://localhost:5000/api/planner/${userId}`
      );

      setTodayTasks(tasksRes.data || []);
      setTodayPlanners(plannersRes.data || []);
      setAllTasks(allTasksRes.data || []);
      setAllPlanners(allPlannersRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load + periodic refresh
  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 30000); // refresh every 30s
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, toDateKey(now)]); // refetch if user or dateKey changes

  // Optional: fetch quote if QuoteWidget doesn't already
  useEffect(() => {
    if (!quote) {
      // small local pool of quotes, or you may fetch from an API
      const pool = [
        "Small consistent actions build massive results.",
        "Focus on progress, not perfection.",
        "Study smarter — schedule, practice, review.",
        "The secret of getting ahead is getting started.",
      ];
      setQuote(pool[Math.floor(Math.random() * pool.length)]);
    }
  }, [quote]);

  // Derived metrics
  const metrics = useMemo(() => {
    // Tasks metrics for pie chart
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.status === "Completed").length;
    const pending = total - completed;
    const overdue = todayTasks.filter((t) => {
      if (!t.deadline) return false;
      const dl = new Date(t.deadline);
      const nowDate = new Date();
      // if deadline before today start and status not completed -> overdue
      return (
        dl < new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()) &&
        t.status !== "Completed"
      );
    }).length;

    // Hours planned vs hours completed today:
    // planned hours = sum of planner.targetHours for today (and dailyGoal entries count as targetHours per day)
    // completedHours = sum of estimatedTime for tasks with status Completed and deadline today
    const plannedHours = todayPlanners.reduce((acc, p) => {
      // targetHours might be number or string
      const th = Number(p.targetHours || 0);
      // if dailyGoal true and start-end span multiple days, the targetHours is per day assumed
      return acc + (isNaN(th) ? 0 : th);
    }, 0);

    const completedHours = todayTasks.reduce((acc, t) => {
      if (t.status === "Completed") {
        const et = Number(t.estimatedTime || t.estimatedTime === 0 ? t.estimatedTime : 0);
        return acc + (isNaN(et) ? 0 : Number(et));
      }
      return acc;
    }, 0);

    // weekly progress: percentage of planned hours done across last 7 days
    // We'll compute planned and completed for each day by scanning allPlanners & allTasks
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(toDateKey(d));
    }

    const weekly = last7.map((dayKey) => {
      // planners: entries active on that day
      const plannersForDay = allPlanners.filter((p) => {
        if (p.dailyGoal) {
          // p.startDate and p.endDate expected as ISO strings
          const s = p.startDate ? toDateKey(p.startDate) : null;
          const e = p.endDate ? toDateKey(p.endDate) : null;
          if (s && e) return s <= dayKey && dayKey <= e;
          return false;
        }
        // else single-date planners may have date property (some models)
        const pd = p.date ? toDateKey(p.date) : null;
        return pd === dayKey;
      });

      const plannedForDay = plannersForDay.reduce((acc, p) => acc + (Number(p.targetHours) || 0), 0);

      const tasksForDay = allTasks.filter((t) => {
        if (!t.deadline) return false;
        return toDateKey(t.deadline) === dayKey;
      });

      const completedForDay = tasksForDay.reduce((acc, t) => acc + ((t.status === "Completed") ? (Number(t.estimatedTime) || 0) : 0), 0);

      return {
        day: dayKey,
        planned: plannedForDay,
        completed: completedForDay,
      };
    });

    const weeklyPlanned = weekly.reduce((a, b) => a + b.planned, 0);
    const weeklyCompleted = weekly.reduce((a, b) => a + b.completed, 0);
    const weeklyPercent = weeklyPlanned === 0 ? 0 : Math.round((weeklyCompleted / weeklyPlanned) * 100);

    return {
      total,
      completed,
      pending,
      overdue,
      plannedHours,
      completedHours,
      weeklyPercent,
      weekly,
    };
  }, [todayTasks, todayPlanners, allTasks, allPlanners, now]);

  // Data for pie chart
  const pieData = [
    { name: "Completed", value: metrics.completed },
    { name: "Pending", value: metrics.pending },
    { name: "Overdue", value: metrics.overdue },
  ];

  // small helper for percent text safety
  const safePercent = (a, b) => {
    if (b === 0) return 0;
    return Math.round((a / b) * 100);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full min-h-screen p-8 ml-64 bg-gray-50">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-700">StudyNsquare</h1>
            <p className="mt-2 text-gray-700">{quote && <em>“{quote}”</em>}</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Today</div>
            <div className="text-lg font-medium">{toDateKey(now)}</div>
            <div className="text-gray-600">{now.toLocaleTimeString()}</div>
          </div>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left column: Today's tasks & planners */}
          <div className="space-y-4 md:col-span-2">
            <div className="p-4 bg-white shadow rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Today's Plans & Tasks</h2>
                <div className="text-sm text-gray-500">{loading ? "Refreshing..." : "Live"}</div>
              </div>

              {/* today's planners */}
              <div className="mb-3">
                <h3 className="mb-2 text-sm text-gray-600">Planned study (today)</h3>
                {todayPlanners.length === 0 ? (
                  <p className="text-gray-500">No planner entries for today.</p>
                ) : (
                  <ul className="space-y-2">
                    {todayPlanners.map((p) => (
                      <li key={p._id} className="p-3 border rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">{p.subject}</div>
                            <div className="text-xs text-gray-500">{p.notes}</div>
                          </div>
                          <div className="text-sm text-gray-800">{p.targetHours || 0} hrs</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* today's tasks */}
              <div>
                <h3 className="mb-2 text-sm text-gray-600">Tasks due today</h3>
                {todayTasks.length === 0 ? (
                  <p className="text-gray-500">No tasks due today.</p>
                ) : (
                  <ul className="space-y-2">
                    {todayTasks.map((t) => (
                      <li key={t._id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div>
                          <div className={`font-semibold ${t.status === "Completed" ? "text-green-600" : ""}`}>{t.taskName}</div>
                          <div className="text-xs text-gray-500">{t.relatedSubject}</div>
                          <div className="text-xs text-gray-400">Est: {t.estimatedTime || 0} hrs</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{t.status}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Progress bars (Daily & Weekly) */}
            <div className="grid grid-cols-1 gap-4 p-4 bg-white shadow rounded-xl md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Daily Progress</h4>
                <div className="mb-1 text-sm text-gray-500">Hours: {metrics.completedHours}/{metrics.plannedHours} hrs</div>
                <div className="w-full h-4 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    style={{
                      width: `${Math.min(100, safePercent(metrics.completedHours, metrics.plannedHours))}%`,
                    }}
                    className="h-4 bg-gradient-to-r from-indigo-500 to-green-400"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">If planned hours are 0, progress shows 0%.</div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Weekly Progress</h4>
                <div className="mb-1 text-sm text-gray-500">{metrics.weeklyPercent}% of planned hours</div>
                <div className="w-full h-4 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    style={{
                      width: `${Math.min(100, metrics.weeklyPercent)}%`,
                    }}
                    className="h-4 bg-gradient-to-r from-orange-400 to-yellow-300"
                  />
                </div>

                <div className="mt-3">
                  <h5 className="mb-1 text-sm font-medium">Last 7 days (planned → done)</h5>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {metrics.weekly.map((d) => (
                      <div key={d.day} className="text-center">
                        <div className="font-semibold">{d.planned}</div>
                        <div className="text-gray-500">{d.completed}</div>
                        <div className="text-xs">{d.day.slice(5)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Deadlines + Pie */}
          <div className="space-y-4">
            <div className="p-4 bg-white shadow rounded-xl">
              <h3 className="mb-3 font-semibold">📌 Upcoming Deadlines</h3>
              {/* show next 5 upcoming deadlines from allTasks */}
              {allTasks && allTasks.length > 0 ? (
                <div className="space-y-2">
                  {allTasks
                    .filter((t) => t.status !== "Completed" && t.deadline)
                    .map((t) => ({ ...t, d: new Date(t.deadline) }))
                    .sort((a, b) => a.d - b.d)
                    .slice(0, 5)
                    .map((t) => (
                      <div key={t._id} className="flex justify-between p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{t.taskName}</div>
                          <div className="text-xs text-gray-500">{t.relatedSubject}</div>
                        </div>
                        <div className="text-xs text-gray-600">{new Date(t.deadline).toLocaleDateString()}</div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-gray-500">No upcoming deadlines.</p>
              )}
            </div>

            <div className="p-4 bg-white shadow rounded-xl">
              <h3 className="mb-3 font-semibold">Task Status (Today)</h3>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => (entry.value > 0 ? `${entry.name} (${entry.value})` : "")}
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Completed: {metrics.completed} • Pending: {metrics.pending} • Overdue: {metrics.overdue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
