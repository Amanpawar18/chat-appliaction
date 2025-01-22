import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";

config();


// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinaryWithLocalPath = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    let response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath); // remove the local saved file as upload failes
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the local saved file as upload failes
  }
};

export { uploadOnCloudinaryWithLocalPath };
export default cloudinary;

