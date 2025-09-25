import { createSlice } from "@reduxjs/toolkit";

export const metricSlice = createSlice({
  name: "metrics",
  initialState: {
    value: "°C",
  },
  reducers: {
    returnMetric: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state.value;
    },
    changeFahren: (state) => {
      state.value = "°F";
    },
    changeCelsius: (state) => {
      state.value = "°C";
    },
  },
});

// Action creators are generated for each case reducer function
export const { returnMetric, changeFahren, changeCelsius } =
  metricSlice.actions;

export default metricSlice.reducer;
