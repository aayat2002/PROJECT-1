const express = require("express");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

// if we get only users then the result was html
app.get("/users", (req, res) => {
  const html = `
        <ul>
          ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
      `;
  res.send(html);
});

// Routes define
// (hybrid server)
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Fixed route chaining syntax
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
    // todo: edit user with id
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    // todo: delete the user with id
    return res.json({ status: "pending" });
  });

app.post("/api/users", (req, res) => {
  // todo: create new users
  return res.json({ status: "pending" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
