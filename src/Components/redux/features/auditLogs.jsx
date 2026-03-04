import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "../../../api/api";

// Log user login
export const logUserLogin = createAsyncThunk(
  "audit/logUserLogin",
  async (username) => {
    const payload = {
      user_name: username,
      sso_id:''
    };
    await request({
      url: "/icontract/audit/login-log",
      method: "POST",
      data: payload
    });
    return payload;
  }
);

// Log user logout
export const logUserLogout = createAsyncThunk(
  "audit/logUserLogout",
  async (username) => {
    const payload = {
      user_name: username,
      sso_id:''
    };
    await request({
      url: "/icontract/audit/logout-log",
      method: "POST",
      data: payload
    });
    return payload;
  }
);

const auditSlice = createSlice({
  name: "audit",
  initialState: {
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(logUserLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logUserLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logUserLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      .addCase(logUserLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logUserLogout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logUserLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  }
});

export default auditSlice.reducer;
