var jwt = require("jsonwebtoken");
const JWT_SECRET = "Prakhar@Verma";

const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and add ID to req object
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });

  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);

    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};
module.exports = fetchuser;
