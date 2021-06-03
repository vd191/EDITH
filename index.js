require("dotenv").config();
const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule");
const davinci = require("./services/davinci");
const edith = require("./services/edith");
const app = express();
const port = process.env.PORT || 3000;

const j = schedule.scheduleJob('0 8 * * *', function () {
  console.log("Report balance");
  davinci.reportBalance();
});

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/edith", edith.index);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
