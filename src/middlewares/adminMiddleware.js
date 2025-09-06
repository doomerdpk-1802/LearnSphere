const jwt = require("jsonwebtoken");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

if (!JWT_SECRET_ADMIN) {
  throw new Error("JWT_SECRET_ADMIN is not defined in environment variables");
}

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const token = authHeader;

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET_ADMIN);
    req.adminId = decodedUser.adminId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized!" });
  }
}

module.exports = { adminMiddleware };
