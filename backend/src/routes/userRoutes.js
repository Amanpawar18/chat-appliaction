import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import {
  editProfileDetails,
  getProfileDetails,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protectedRoute, getProfileDetails);
router.post("/profile", protectedRoute, editProfileDetails);

export default router;
