import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";
import metric from "./metrcisSlice";
import speed from "./speedSlice";
const store = configureStore({
  reducer: {
    weather: weatherReducer,
    metricTemperature: metric,
    metricSpeed: speed,
  },
});

export default store;

// čitanje jedinice:

// export const getUnit = () => store.getState().metrics.m_temp;
