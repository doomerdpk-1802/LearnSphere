const jwt = require("jsonwebtoken");
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

function userMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const decodedUser = jwt.verify(token, JWT_SECRET_USER);
  if (decodedUser) {
    req.userId = decodedUser.userId;
    next();
  } else {
    return res.status(401).json({ error: "Unauthorized!" });
  }
}

module.exports = { userMiddleware };
