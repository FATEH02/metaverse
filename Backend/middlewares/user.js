import jwt from "jsonwebtoken";

export const userMiddleware = (req, res, next) => {
  const header = req.headers["authorization"]; // ✅ Correct spelling
  const token = header?.split(" ")[1];

  // console.log("reached here");

  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "fateh"); // ✅ Correct object
    req.userId = decoded.userId;
    console.log("Decoded userId:", req.userId);
    next();
  } catch (e) {
    console.error("JWT Error:", e.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
