import jwt from "jsonwebtoken";

 const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      username: decoded.username, // 🔥 IMPORTANT
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
export default verifyJWT;
