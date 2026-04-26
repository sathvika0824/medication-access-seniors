// server.js
import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;
const DATA_FILE = "./patients.json";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Load existing data
let patients = [];
if (fs.existsSync(DATA_FILE)) {
  patients = JSON.parse(fs.readFileSync(DATA_FILE, "utf8") || "[]");
}

// GET patients
app.get("/api/patients", (req, res) => {
  res.json(patients);
});

// POST patient
app.post("/api/patients", (req, res) => {
  const p = req.body;
  if (!p.name || !p.age || !p.contact || !p.bloodGroup || !p.address) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  patients.push(p);
  fs.writeFileSync(DATA_FILE, JSON.stringify(patients, null, 2));
  res.status(201).json({ message: "Patient added" });
});
app.get("/", (req, res) => {
  res.send("✅ Backend is working perfectly, Saath!");
});
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
