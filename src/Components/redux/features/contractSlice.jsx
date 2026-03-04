import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { NodeURL } from "../../../api/api";

// ✅ Thunk to fetch contract list
export const getContracts = createAsyncThunk(
  "contracts/getContracts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${NodeURL}/icontract/backend/columns/names`); // Replace with actual endpoint
      return response.data.data; // Assumes API returns array of contracts
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  contracts: [],
  contractsList:[],
  loading: false,
  error: null,
};

export const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    saveContracts:(state,action)=>{
        state.contracts =action.payload;
    },
    clearContracts: (state) => {
      state.contracts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContracts.fulfilled, (state, action) => {
        state.contractsList = action.payload;
        state.loading = false;
      })
      .addCase(getContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch contracts";
      });
  },
});

export const { clearContracts, saveContracts } =
  contractsSlice.actions;

export default contractsSlice.reducer;
