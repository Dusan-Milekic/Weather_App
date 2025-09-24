import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTemperature } from "../api/apiWeather";

// async thunk za poziv API-ja
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (location) => {
    const data = await getTemperature(location);
    return data;
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    hourly: {},
    daily: {},
    minute15: {},
    current: {},
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearWeather: (state) => {
      state.hourly = {};
      state.daily = {};
      state.minute15 = {};
      state.current = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ovde upisuješ podatke koje getTemperature vraća
        state.current = {
          temperature: action.payload.temperature,
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        };
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
