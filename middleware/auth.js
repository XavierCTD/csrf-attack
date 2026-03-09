const auth = async (req, res, next) => {
  if (req.user) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send('Authentication required. Use "/login-demo" to test browser flow.');
  }
  const token = authHeader.split(" ")[1];

  try {
    const jwt = require("jsonwebtoken");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: payload.userId,
      userId: payload.userId,
      name: payload.name,
    };
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Authentication invalid" });
  }
};

module.exports = auth;
