import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password)
    throw new ApiError(400, "All fields are required.");

  const userExist = await User.findOne({ email });

  if (userExist) throw new ApiError(400, "User already exist with this email.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    fullName,
    password: hashedPassword,
  });

  if (!user) throw new ApiError(500, "Failed to register user.");

  generateToken(user._id, res);

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "All fields are required.");

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(400, "Wrong email or password");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) throw new ApiError(400, "Wrong email or password.");

  generateToken(user._id, res);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged in successfully"));
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const checkAuth = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(201, { data: req.user }, "user is authenticated"));
};
