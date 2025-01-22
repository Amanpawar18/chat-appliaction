import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    const res = await axiosInstance.get("/messages/users").catch((err) => {
      toast.error(err.response.data.message);
      console.log("Error in fetching users list:", err);
    });
    if (res) {
      set({ users: res.data.data?.data });
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    const res = await axiosInstance.get(`/messages/${userId}`).catch((err) => {
      toast.error(err.response.data.message);
      console.log("Error in fetching messages", err);
    });
    if (res) {
      set({ messages: res.data.data.data });
      set({ isMessageLoading: false });
      get().subscribeToMessages();
    }
  },

  sendMessage: async (messageData) => {
    set({ isMessageLoading: true });
    const { selectedUser, messages } = get();
    const res = await axiosInstance
      .post(`/messages/send/${selectedUser._id}`, messageData)
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log("Error in fetching messages", err);
      });
    if (res) {
      set({ messages: [...messages, res.data.data.data] });
      set({ isMessageLoading: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    const {socket} = useAuthStore.getState();
    socket.on("newMessage", (message) => {
      console.log([...messages, message]);
      set({
        messages: [...messages, message],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const {socket} = useAuthStore.getState();
    socket.off("newMessage");
  },
}));
