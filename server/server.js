const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const pool = require("./db");
const cors = require('cors');

//Init middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

//Initiliazing the routes referencing files inside routes folder
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/skills", require("./routes/api/skills"));
app.use("/api/student-info", require("./routes/api/student-info"));
app.use("/api/levels", require("./routes/api/trainingLevels"));
app.use("/api/exercises", require("./routes/api/exercises"));
app.use("/api/sessions", require("./routes/api/trainingSessions"));
app.use("/api/modules", require("./routes/api/trainingModules"));
app.use("/api/module-contents", require("./routes/api/moduleContents"));
app.use("/api/quiz-management", require("./routes/api/quiz-management"));
app.use("/api/card-access", require("./routes/api/cardAccess"));
app.use("/api/get-name", require("./routes/api/getNames"));
app.listen(port, () => {
  console.log(`Listening on port: ${port} `);
});
