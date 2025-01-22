import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import errorHandler from "./errorHandlerMiddleware.js";

export const protectedRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token || token == "") return handleErrors(req, res);

  const { userId } = jwt.verify(token, "secret-key");
  if (!userId) return handleErrors(req, res);

  const user = await User.findOne({
    _id: userId,
  });
  if (!user) return handleErrors(req, res);

  req.userId = userId;
  req.user = user;
  next();
};

const handleErrors = (req, res) => {
  return errorHandler(new ApiError(201, "Not logged in !!"), req, res);
};
