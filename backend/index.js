const connectToMongo = require("./db");
const express = require("express");
connectToMongo();

const app = express();
const port = 9000;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

//using middelware for json
app.use(express.json());

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
