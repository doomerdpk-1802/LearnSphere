const jwt = require("jsonwebtoken");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const decodedUser = jwt.verify(token, JWT_SECRET_ADMIN);
  if (decodedUser) {
    req.adminId = decodedUser.adminId;
    next();
  } else {
    return res.status(401).json({ error: "Unauthorized!" });
  }
}

module.exports = { adminMiddleware };
