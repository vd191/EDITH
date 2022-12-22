require("dotenv").config();
const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule");
const edith = require("./services/edith");
const reporter  = require("./services/reporter")
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/edith", edith.index);

app.get("/balance", reporter.balance);
app.get("/positions", reporter.positions);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});