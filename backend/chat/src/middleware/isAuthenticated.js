import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    const authheader = req.headers.authorization;
    if (!authheader || !authheader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Token is invelid or expired",
      });
    }

    const token = authheader.split(" ")[1];
    const decodedValue = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedValue || !decodedValue.user) {
      return res.status(401).json({
        success: false,
        message: "Token is incorrect or invelid",
      });
    }
    req.user = decodedValue.user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "server Error",
    });
  }
};
