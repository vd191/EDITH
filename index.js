require("dotenv").config();
const express = require("express");
const cors = require("cors");
const edith = require("./services/edith");
const app = express();
const port = process.env.PORT || 3000;

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
