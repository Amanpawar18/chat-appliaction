import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../utils/Cloudinary.js";

export const getProfileDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.userId }).select("-password");
  if (!user) throw new ApiError(400, "No user found.");
  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: user }, "User details fetched successfully.")
    );
});

export const editProfileDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.userId }).select("-password");
  if (!user) throw new ApiError(400, "No user found.");

  const { profilePic } = req.body;
  if (profilePic) {
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    user.profilePic = uploadResponse.secure_url;
    await user.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: user }, "User details updated successfully.")
    );
});

