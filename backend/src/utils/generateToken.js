import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, "secret-key", {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.production == "production",
  });
  return token;
};
