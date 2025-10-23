import React, { useEffect, useState } from "react";
import logo from "./assets/bluepark-logo.png";

const Icon = ({ children, style }) => <span style={{ marginRight: 8, ...style }}>{children}</span>;

const STORAGE_KEYS = {
  USERS: "bluepark_users_v1",
  TRIPS: "bluepark_trips_v1",
  CURRENT: "bluepark_current_v1",
};

export default function BlueParkAdmin() {
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newTrip, setNewTrip] = useState({
    org: "",
    start: "",
    end: "",
    time: "",
    capacity: "",
  });
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [
      { username: "azzam", password: "1234", isAdmin: true },
    ];
    const savedTrips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS)) || [];
    const savedCurrent = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT));
    setUsers(savedUsers);
    setTrips(savedTrips);
    setCurrentUser(savedCurrent);
  }, []);

  const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  // ✅ Always store normalized ISO date (YYYY-MM-DD)
  const normalizeDate = (value) => {
    if (!value) return "";
    const dt = new Date(value);
    if (isNaN(dt)) return value;
    return dt.toISOString().slice(0, 10);
  };

  // ✅ Force format in English Gregorian, not Arabic Hijri
  const formatDate = (value) => {
    if (!value) return "";
    try {
      const date = new Date(value);
      if (isNaN(date)) return value;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      });
    } catch {
      return value;
    }
  };

  const login = () => {
    const { username, password } = loginData;
    const found = users.find((u) => u.username === username && u.password === password);
    if (found) {
      setCurrentUser(found);
      saveData(STORAGE_KEYS.CURRENT, found);
      setShowLogin(false);
      setLoginData({ username: "", password: "" });
    } else {
      alert("Invalid username or password");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT);
  };

  const addTrip = () => {
    if (!newTrip.org || !newTrip.start || !newTrip.time || !newTrip.capacity) {
      alert("Please fill all required fields");
      return;
    }

    const startISO = normalizeDate(newTrip.start);
    const endISO = newTrip.end ? normalizeDate(newTrip.end) : "";

    const tripToSave = {
      id: Date.now(),
      org: newTrip.org.trim(),
      start: startISO,
      end: endISO,
      time: newTrip.time,
      capacity: Number(newTrip.capacity) || 0,
    };

    const updated = [...trips, tripToSave];
    setTrips(updated);
    saveData(STORAGE_KEYS.TRIPS, updated);
    setNewTrip({ org: "", start: "", end: "", time: "", capacity: "" });
  };

  const deleteTrip = (id) => {
    if (!window.confirm("Delete this trip?")) return;
    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    saveData(STORAGE_KEYS.TRIPS, updated);
  };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: 24,
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
      color: "#0f172a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background:
        "linear-gradient(135deg, rgba(30,64,175,1) 0%, rgba(147,197,253,1) 50%, rgba(255,255,255,1) 100%)",
      backgroundSize: "400% 400%",
      animation: "gradientMove 15s ease infinite",
    },
    card: {
      width: "100%",
      maxWidth: 980,
      background: "rgba(255,255,255,0.90)",
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
      padding: 22,
      marginBottom: 18,
      backdropFilter: "blur(6px)",
    },
    headerLogo: {
      width: 110,
      height: 110,
      objectFit: "contain",
      borderRadius: 12,
      boxShadow: "0 6px 18px rgba(2,6,23,0.12)",
      display: "block",
      margin: "0 auto 12px",
    },
    title: { textAlign: "center", color: "#1446A0", margin: 0, fontSize: 32, fontWeight: 700 },
    tagline: { textAlign: "center", color: "#334155", marginTop: 6 },
    btnPrimary: {
      background: "#0ea5e9",
      color: "#fff",
      border: "none",
      padding: "10px 14px",
      borderRadius: 10,
      cursor: "pointer",
      boxShadow: "0 6px 16px rgba(14,165,233,0.18)",
      transition: "transform 0.2s",
    },
    btnDanger: {
      background: "#ef4444",
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: 8,
      cursor: "pointer",
    },
    tripCard: {
      borderRadius: 12,
      padding: 14,
      background: "linear-gradient(90deg, rgba(240,249,255,1) 0%, rgba(255,255,255,1) 100%)",
      boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
      border: "1px solid rgba(15,66,140,0.06)",
      marginTop: 10,
    },
    input: {
      padding: 10,
      borderRadius: 8,
      border: "1px solid #CBD5E1",
      width: "100%",
      outline: "none",
      transition: "border-color 0.3s",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },
    loginCard: {
      background: "#fff",
      padding: 24,
      borderRadius: 12,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      width: 300,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
  };

  return (
    <div style={styles.page}>
      <style>
        {`@keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }`}
      </style>

      {/* Header */}
      <div style={styles.card}>
        <img src={logo} alt="BluePark Logo" style={styles.headerLogo} />
        <h1 style={styles.title}>BluePark</h1>
        <p style={styles.tagline}>Trips Schedule</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 14 }}>
          {!currentUser ? (
            <button onClick={() => setShowLogin(true)} style={styles.btnPrimary}>
              🌐 Admin Login
            </button>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700 }}>{currentUser.username}</span>
                <span style={{ color: "#475569", fontSize: 13 }}>
                  {currentUser.isAdmin ? "Admin" : "User"}
                </span>
              </div>
              <button onClick={logout} style={styles.btnDanger}>
                Log out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login popup */}
      {showLogin && (
        <div style={styles.overlay}>
          <div style={styles.loginCard}>
            <h3 style={{ textAlign: "center", margin: 0, color: "#1446A0" }}>Admin Login</h3>
            <input
              style={styles.input}
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button onClick={login} style={styles.btnPrimary}>
              Login
            </button>
            <button onClick={() => setShowLogin(false)} style={styles.btnDanger}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Trips */}
      <div style={styles.card}>
        <h2 style={{ margin: 0, color: "#0b57b2" }}>Upcoming Trips</h2>
        {trips.length === 0 && (
          <p style={{ color: "#475569", marginTop: 10 }}>No trips available yet.</p>
        )}
        <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
          {trips.map((trip) => (
            <div key={trip.id} style={styles.tripCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#123e8a" }}>{trip.org}</h3>
                  <div style={{ color: "#334155", marginTop: 8, fontSize: 14 }}>
                    <div>
                      <Icon>📅</Icon>{" "}
                      {trip.end
                        ? `${formatDate(trip.start)} — ${formatDate(trip.end)}`
                        : formatDate(trip.start)}
                    </div>
                    <div>
                      <Icon>⏰</Icon> {trip.time}
                    </div>
                    <div>
                      <Icon>👥</Icon> {trip.capacity} people
                    </div>
                  </div>
                </div>
                {currentUser?.isAdmin && (
                  <button onClick={() => deleteTrip(trip.id)} style={styles.btnDanger}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Dashboard */}
      {currentUser?.isAdmin && (
        <div style={styles.card}>
          <h3>Admin Dashboard</h3>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
            <input
              style={styles.input}
              placeholder="Organization"
              value={newTrip.org}
              onChange={(e) => setNewTrip({ ...newTrip, org: e.target.value })}
            />
            <input
              style={styles.input}
              type="date"
              value={newTrip.start}
              onChange={(e) => setNewTrip({ ...newTrip, start: e.target.value })}
            />
            <input
              style={styles.input}
              type="date"
              value={newTrip.end}
              onChange={(e) => setNewTrip({ ...newTrip, end: e.target.value })}
            />
            <input
              style={styles.input}
              type="time"
              value={newTrip.time}
              onChange={(e) => setNewTrip({ ...newTrip, time: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Capacity"
              type="number"
              value={newTrip.capacity}
              onChange={(e) => setNewTrip({ ...newTrip, capacity: e.target.value })}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={addTrip} style={styles.btnPrimary}>
                ➕ Add Trip
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, width: "100%", maxWidth: 980, textAlign: "center", color: "#0b1433" }}>
        Made by <strong>Eng.Azzam</strong>
      </div>
    </div>
  );
}
