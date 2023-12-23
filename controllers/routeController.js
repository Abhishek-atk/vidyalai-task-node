const { userDB } = require("../db/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "nxNDt5cQ93jPok8B87kYind02nf9dlFF7hB12WHnKKjLz10";
module.exports = {
  doSignUp: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await userDB
          .findOne({ email: userData.email })
          .lean()
          .exec();
        if (userExist) {
          resolve({
            msg: "This User Already Exist",
            signup: false,
          });
        } else {
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const newUser = await userDB.create({
            userName: userData.userName,
            email: userData.email,
            password: hashedPassword,
          });
          const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
          resolve({
            newUser,
            msg: "Signup successful",
            signup: true,
            token: token,
          });
        }
      } catch (error) {
        console.error("Database error:", error);
        reject("Signup failed");
      }
    });
  },
  doLogIn: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await userDB
          .findOne({ email: userData.email })
          .lean()
          .exec();
        if (user) {
          const passwordMatch = await bcrypt.compare(
            userData.password,
            user.password
          );
          if (passwordMatch) {
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);
            resolve({
              user,
              msg: "Login successful",
              login: true,
              token: token,
            });
          } else {
            resolve({ msg: "Invalid email or password", login: false });
          }
        } else {
          resolve({ msg: "Invalid email or password", login: false });
        }
      } catch (error) {
        console.error("Database error:", error);
        reject("Login failed");
      }
    });
  },
  addFile: (userId, fileName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await userDB.findOne({ _id: userId }).lean().exec();
        if (userExist) {
          const updated = await userDB.updateOne(
            { _id: userId },
            { $push: { uploadedFile: fileName } }
          );
          resolve({ msg: "file added to DataBase", updated });
        } else {
          resolve({ msg: "failed to add file in DataBase" });
        }
      } catch (error) {
        reject(`Error adding file to database`);
      }
    });
  },
  getUploadedFile: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await userDB.findOne({ _id: userId }).lean().exec();
        if (userExist) {
          const files = userExist.uploadedFile;
          resolve({ msg: "file added to DataBase", files });
        } else {
          resolve({ msg: "This user not exist" });
        }
      } catch (error) {
        reject(`Error to fetch user in database`);
      }
    });
  },
};
