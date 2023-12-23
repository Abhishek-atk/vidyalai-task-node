require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "nxNDt5cQ93jPok8B87kYind02nf9dlFF7hB12WHnKKjLz10";

module.exports = {
    verifyloggedIn: (req, res, next) => {
        const jwtToken = req.cookies.token;
        jwt.verify(jwtToken,JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Token error");
                return res.status(201).json({ msg: "Unauthorized", validToken: false });
            } else {
                next();
            }
        });
    }
};
