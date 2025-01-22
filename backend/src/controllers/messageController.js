import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../utils/Cloudinary.js";

export const getUsersForSideBar = asyncHandler(async (req, res) => {
  const filteredUsers = await User.find({
    _id: { $ne: req.userId },
  }).select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: filteredUsers },
        "Users fetched successfully !!"
      )
    );
});

export const getUserMessages = asyncHandler(async (req, res) => {
  const { id: userToChatWithId } = req.params;
  const loggedInUserId = req.userId;
  const filteredUsers = await Message.find({
    $or: [
      { senderId: userToChatWithId, receiverId: loggedInUserId },
      { receiverId: userToChatWithId, senderId: loggedInUserId },
    ],
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: filteredUsers },
        "Messages fetched successfully !!"
      )
    );
});

export const sendUserMessage = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.userId;
  const { text, image } = req.body;
  let imageUrl = "";
  if (image) {
    let imageResponse = await cloudinary.uploader.upload(image);
    imageUrl = imageResponse.secure_url;
  }
  const message = await Message.create({
    receiverId,
    senderId,
    text,
    image: imageUrl,
  });

  if (!message) throw new ApiError(500, "Failed to send the message");

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: message }, "Users fetched successfully !!")
    );
});
