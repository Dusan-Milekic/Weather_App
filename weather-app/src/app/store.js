import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice"; // putanja do tvog slice fajla

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

export default store;
