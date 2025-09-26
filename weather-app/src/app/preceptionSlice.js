import { createSlice } from "@reduxjs/toolkit";

export const preceptionSlice = createSlice({
  name: "preception",
  initialState: {
    value: "mm",
  },
  reducers: {
    changeMM: (state) => {
      state.value = "mm";
    },
    changeIN: (state) => {
      state.value = "in";
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeMM, changeIN } = preceptionSlice.actions;

export default preceptionSlice.reducer;
