const express = require("express");
const users = require("./MOCK_DATA.json");
const app = express();
const fs = require("fs");
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

// middleware plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.tsx",
    `\n${Date.now()}: ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

// if we get only users then the result was html
app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// API route to get all users
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Route chaining for user ID
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users[userIndex] = {
      ...users[userIndex],
      ...req.body,
    };

    return res.json({ message: "User updated", user: users[userIndex] });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(userIndex, 1);

    return res.json({ message: "User deleted", user: deletedUser[0] });
  });

// Create new user
app.post("/api/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
  };

  users.push(newUser);

  return res.status(201).json({ message: "User created", user: newUser });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
