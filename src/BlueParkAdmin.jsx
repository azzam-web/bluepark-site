import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";

export default function BlueParkAdmin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([{ username: "admin", password: "1234", isAdmin: true }]);
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    org: "",
    start: "",
    end: "",
    time: "",
    people: "",
  });
  const [editingTrip, setEditingTrip] = useState(null);

  const tripsCollection = collection(db, "trips");

  // Load trips from Firestore
  useEffect(() => {
    const loadTrips = async () => {
      const querySnapshot = await getDocs(tripsCollection);
      const tripData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(tripData);
    };
    loadTrips();
  }, []);

  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) setCurrentUser(user);
    else alert("Invalid credentials");
  };

  const handleAddTrip = async () => {
    if (!newTrip.org || !newTrip.start || !newTrip.time) return alert("Please fill all required fields");
    await addDoc(tripsCollection, newTrip);
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    setNewTrip({ org: "", start: "", end: "", time: "", people: "" });
  };

  const handleEditTrip = async (id, updatedTrip) => {
    const tripRef = doc(db, "trips", id);
    await updateDoc(tripRef, updatedTrip);
    setTrips(trips.map((t) => (t.id === id ? { ...t, ...updatedTrip } : t)));
    setEditingTrip(null);
  };

  const handleDeleteTrip = async (id) => {
    await deleteDoc(doc(db, "trips", id));
    setTrips(trips.filter((t) => t.id !== id));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>BluePark Admin Dashboard</h1>

      <div style={styles.form}>
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
          placeholder="Number of People"
          value={newTrip.people}
          onChange={(e) => setNewTrip({ ...newTrip, people: e.target.value })}
        />
        <button style={styles.button} onClick={handleAddTrip}>
          Add Trip
        </button>
      </div>

      <div style={styles.list}>
        {trips.map((trip) => (
          <div key={trip.id} style={styles.tripCard}>
            {editingTrip === trip.id ? (
              <TripEditor
                trip={trip}
                onSave={(updated) => handleEditTrip(trip.id, updated)}
                onCancel={() => setEditingTrip(null)}
              />
            ) : (
              <>
                <p><strong>Organization:</strong> {trip.org}</p>
                <p><strong>Dates:</strong> {trip.start} — {trip.end || "N/A"}</p>
                <p><strong>Time:</strong> {trip.time}</p>
                <p><strong>People:</strong> {trip.people}</p>
                <button style={styles.smallBtn} onClick={() => setEditingTrip(trip.id)}>Edit</button>
                <button style={styles.smallBtn} onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
      <p style={styles.footer}>Made by Eng. Azzam</p>
    </div>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div style={styles.loginBox}>
      <h2>BluePark Admin Login</h2>
      <input
        style={styles.input}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={styles.button} onClick={() => onLogin(username, password)}>
        Login
      </button>
    </div>
  );
}

function TripEditor({ trip, onSave, onCancel }) {
  const [edited, setEdited] = useState(trip);
  return (
    <div>
      <input
        style={styles.input}
        value={edited.org}
        onChange={(e) => setEdited({ ...edited, org: e.target.value })}
      />
      <input
        style={styles.input}
        type="date"
        value={edited.start}
        onChange={(e) => setEdited({ ...edited, start: e.target.value })}
      />
      <input
        style={styles.input}
        type="date"
        value={edited.end}
        onChange={(e) => setEdited({ ...edited, end: e.target.value })}
      />
      <input
        style={styles.input}
        type="time"
        value={edited.time}
        onChange={(e) => setEdited({ ...edited, time: e.target.value })}
      />
      <input
        style={styles.input}
        value={edited.people}
        onChange={(e) => setEdited({ ...edited, people: e.target.value })}
      />
      <button style={styles.smallBtn} onClick={() => onSave(edited)}>Save</button>
      <button style={styles.smallBtn} onClick={onCancel}>Cancel</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    maxWidth: 800,
    margin: "0 auto",
    padding: 20,
  },
  header: { color: "#007BFF", fontSize: 30 },
  form: { marginBottom: 20 },
  input: { margin: 5, padding: 8, borderRadius: 6, border: "1px solid #ccc" },
  button: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  smallBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "6px 10px",
    margin: 4,
    borderRadius: 5,
    cursor: "pointer",
  },
  list: { marginTop: 20 },
  tripCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    color: "#777",
  },
  loginBox: {
    textAlign: "center",
    marginTop: 100,
  },
};
