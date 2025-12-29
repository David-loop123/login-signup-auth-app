const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));


function readUsers() {
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username and password required" });

  const users = readUsers();
  if (users.some((u) => u.username === username))
    return res.status(400).json({ success: false, message: "Username already exists" });

  users.push({ username, password });
  saveUsers(users);

  res.json({ success: true, message: "User registered successfully" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username and password required" });

  const users = readUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  res.json({ success: true, message: "Login successful" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
