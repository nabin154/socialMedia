import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  posts: [],
  messages:[],
  onlineUsers: null,
  commentUsers: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.posts= null;
      state.commentUsers=null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setReceivedFriendRequests: (state, action) => {
      if (state.user) {
        state.user.friendRequest.received = action.payload.friends;
      } else {
        console.error("user friendRequest non-existent :(");
      }
    },
    setSentFriendRequests: (state, action) => {
      if (state.user) {
        state.user.friendRequest.sent = action.payload.friends;
      } else {
        console.error("user friendRequest non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

        
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setSentFriendRequests,
  setReceivedFriendRequests,
  setCommentUsers,
  setMessages,
  setOnlineUsers
} = authSlice.actions;
export default authSlice.reducer;
