const jwt = require("jsonwebtoken");
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

if (!JWT_SECRET_USER) {
  throw new Error("JWT_SECRET_USER is not defined in environment variables");
}

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const token = authHeader;

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET_USER);
    req.userId = decodedUser.userId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized!" });
  }
}

module.exports = { userMiddleware };
