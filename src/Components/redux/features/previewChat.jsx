import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatMessages: [],
};


export const messagePreviewSlice = createSlice({
  name: "preview",
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
    clearChat:(state)=>{
        state.chatMessages=[]
    }
    
  },
});

export const { addMessageByUser, addMessageByBot,clearChat} =
  messagePreviewSlice.actions;

export default messagePreviewSlice.reducer;