import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const baseURL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoginingIn: false,
  isUpdatingProfile: false,
  isCheckingUser: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingUser: true });
    const res = await axiosInstance.get("/auth/check/").catch((err) => {
      console.log("Error in checking auth user", err);
    });
    if (res.data.success != false) {
      set({ authUser: res.data.data.data });
      get().connectSocket();
    } else {
      set({ authUser: null });
    }
    set({ isCheckingUser: false });
  },

  logout: async () => {
    set({ isCheckingUser: true });
    await axiosInstance.post("/auth/logout/").catch((err) => {
      console.log("Error in logging out user", err);
    });
    toast.success("Logged out successfully !!");
    get().disconnectSocket();
    set({ authUser: null });
    set({ isCheckingUser: false });
  },

  updateProfile: async (profiePic) => {
    set({ isUpdatingProfile: true });
    const res = await axiosInstance
      .post("/user/profile", profiePic)
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log("Error in updating user", err);
      });
    if (res) {
      toast.success("Profile updated succesfully !!");
    }
    set({ isUpdatingProfile: false });
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(baseURL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    // It has to be same as we used in emit in backend
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
