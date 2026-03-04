import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatMessages: [],
};


export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessageByUser: (state, action) => {
      state.chatMessages.push({
        role:'user',
        message:action.payload
      });
    },
    addMessageByBot: (state, action) => {
      state.chatMessages.push({
        role:'bot',
        message:action.payload
      });
    },
    
  },
});

export const { addMessageByUser, addMessageByBot } =
  messageSlice.actions;

export default messageSlice.reducer;