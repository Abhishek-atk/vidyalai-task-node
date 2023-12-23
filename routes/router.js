const router = require("express").Router();
const controller = require("../controllers/routeController");
const multer = require("multer");
const {
  doSignUp,
  doLogIn,
  addFile,
  getUploadedFile
} = require("../controllers/routeController");
const { verifyloggedIn } = require("../middleware/middlewares");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//=> Routes
router.post("/signup", async (req, res) => {
  try {
    const { userData } = req.body;
    const result = await doSignUp(userData).then((response) => {
      res.status(200).json({
        message: response.msg,
        user: response.newUser,
        signup: response.signup,
        token: response.token,
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { userData } = req.body;
    const result = await doLogIn(userData).then((response) => {
      res.status(200).json({
        message: response.msg,
        user: response.user,
        login: response.login,
        token: response.token,
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const token = req.headers.token;
    const userId = jwt.decode(token).userId;
    const fileName = req.file.filename
    const result = await addFile(userId, fileName).then((response) => {
      res
        .status(200)
        .json({ fileName: req.file.filename, path: req.file.path });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/uploaded-pdf", async(req, res) => {
      const token = req.headers.token;
  const userId = jwt.decode(token).userId;
  const result = await getUploadedFile(userId).then((response) => {
      res.status(200).json({
        message: response.msg,
        files: response.files
      });
    
  }).catch(err => {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  })
  
})

module.exports = router;
