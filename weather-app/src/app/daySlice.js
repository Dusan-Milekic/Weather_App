import { createSlice } from "@reduxjs/toolkit";
const date = new Date();
export const daySlice = createSlice({
  name: "day",
  initialState: {
    value: date.getDay(),
  },
  reducers: {
    changeDay: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { returnMetric, changeDay } = daySlice.actions;

export default daySlice.reducer;
