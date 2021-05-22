require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const edith = require("./services/edith");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/edith", edith.index);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
