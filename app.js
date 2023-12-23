const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 4000;
const app = express();
const router = require("./routes/router");
require("./db/connection")
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://abhishek-atk-vidyalai-task.netlify.app",
  })
);
app.get("/uploads/:fileName", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.fileName);
  res.sendFile(filePath, {
    headers: {
      "Access-Control-Allow-Origin":
        "https://abhishek-atk-vidyalai-task.netlify.app",
    },
  });
});
app.use(bodyParser.json());
app.use("/", router);
app.listen(PORT, () => console.log(`Server running at PORT: ${PORT}`));
