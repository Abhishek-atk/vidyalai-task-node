const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://test:TrhDNTJcLIskaVxR@test.yqdsxdn.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Connection Failed");
    console.log(err);
  });
  