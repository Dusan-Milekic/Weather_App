import { createSlice } from "@reduxjs/toolkit";

export const speedSlice = createSlice({
  name: "speed",
  initialState: {
    value: "kmh",
  },
  reducers: {
    returnMetric: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state.value;
    },
    changeKM: (state) => {
      state.value = "kmh";
    },
    changeMPH: (state) => {
      state.value = "mph";
    },
  },
});

// Action creators are generated for each case reducer function
export const { returnMetric, changeKM, changeMPH } = speedSlice.actions;

export default speedSlice.reducer;
