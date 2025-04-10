import jwt from "jsonwebtoken";

export const adminMiddleware = (req, res, next) => {
  const header = req.headers["authorization"]; //Bearer token
  const token = header?.split(" ")[1];
   console.log("what");
   console.log(token);
   
  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "fateh");
    
    console.log("decoded");
    
    if(decoded.role!=="Admin")
    {
        res.status(403).json({message:"Unauthorized"})
        return
    }
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
