// In-memory activity log (resets on page refresh — replace with API/localStorage as needed)
const logs = [
  { id: 1, actor: "admin777",  role: "admin",  action: "Approved deposit",   target: "km****1851", amount: "₹2,000",  date: "28 May, 11:05" },
  { id: 2, actor: "admin777",  role: "admin",  action: "Rejected withdrawal", target: "vi****9901", amount: "₹800",    date: "28 May, 10:58" },
  { id: 3, actor: "agent777",  role: "agent",  action: "Created user",        target: "new****001", amount: "—",       date: "28 May, 10:30" },
  { id: 4, actor: "master777", role: "master", action: "Created admin",       target: "admin777",   amount: "—",       date: "27 May, 09:00" },
  { id: 5, actor: "admin777",  role: "admin",  action: "Blocked user",        target: "su****3312", amount: "—",       date: "27 May, 14:20" },
  { id: 6, actor: "agent777",  role: "agent",  action: "Updated user balance",target: "km****1851", amount: "₹500",    date: "27 May, 16:45" },
];

let nextId = logs.length + 1;

export const getLogs = () => [...logs].reverse();

export const addLog = (actor, role, action, target = "—", amount = "—") => {
  const now = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
  logs.push({ id: nextId++, actor, role, action, target, amount, date: now });
};
