// src/app/weatherSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GetWeatherLocation from "../api/apiWeather"; // ← koristi bogat payload

// Helpers
const toDate = (v) => (v instanceof Date ? v : new Date(v ?? Date.now()));
const num = (v, fallback = null) =>
  v == null || Number.isNaN(Number(v)) ? fallback : Number(v);

// Thunk – dovlači kompletne podatke za lokaciju
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (location = "Belgrade") => {
    const data = await GetWeatherLocation(location);

    // Meta / coords
    const meta = data?.meta ?? {};
    const latitude = num(meta.latitude);
    const longitude = num(meta.longitude);
    const city = meta.location_name ?? location;
    const country = meta.country_code ?? "Serbia";

    // Current blok (iz API-ja ili fallback iz hourly)
    const cur = data?.current ?? {};
    const temperature_2m = num(cur.temperature_2m);
    const apparent_temperature = num(cur.apparent_temperature);
    const relative_humidity_2m = num(cur.relative_humidity_2m);
    const wind_speed_10m = num(cur.wind_speed_10m);
    const precipitation = num(cur.precipitation);
    const is_day = num(cur.is_day, 1);

    // Datum (prefer daily.time[0], inače now)
    const firstTime = data?.daily?.time?.[0] ?? null;
    const d = toDate(firstTime);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });

    return {
      meta,
      // raw sekcije (ako želiš da ih koristiš za grafove)
      hourly: data?.hourly ?? {},
      daily: data?.daily ?? {},
      minute15: data?.minutely15 ?? {},

      // Current uvek popunjen ključevima koje čitaju komponente
      current: {
        latitude,
        longitude,
        temperature_2m,
        apparent_temperature,
        relative_humidity_2m,
        wind_speed_10m,
        precipitation,
        is_day,
      },

      // “flat” polja – zgodna za mapStateToProps bez uvida u .current
      city,
      country,
      temperature: temperature_2m ?? 0,
      is_day,
      day,
      month,
      year,
      dayName,
    };
  }
);

// Slice
const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    hourly: {},
    daily: {},
    minute15: {},
    current: {
      latitude: null,
      longitude: null,
      temperature_2m: null,
      apparent_temperature: null,
      relative_humidity_2m: null,
      wind_speed_10m: null,
      precipitation: null,
      is_day: 1,
    },

    city: "Belgrade",
    country: "Serbia",
    temperature: 0, // mirror temperature_2m radi lakšeg čitanja
    is_day: 1,
    day: 0,
    month: "",
    year: 0,
    dayName: "",

    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearWeather: (state) => {
      state.hourly = {};
      state.daily = {};
      state.minute15 = {};
      state.current = {
        latitude: null,
        longitude: null,
        temperature_2m: null,
        apparent_temperature: null,
        relative_humidity_2m: null,
        wind_speed_10m: null,
        precipitation: null,
        is_day: 1,
      };
      state.city = "Belgrade";
      state.country = "Serbia";
      state.temperature = 0;
      state.is_day = 1;
      state.day = 0;
      state.month = "";
      state.year = 0;
      state.dayName = "";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        const p = action.payload || {};

        // Raw sekcije
        state.hourly = p.hourly ?? {};
        state.daily = p.daily ?? {};
        state.minute15 = p.minute15 ?? {};
        // Current – PREPIŠI eksplicitno ključevima koje očekuju komponente
        const c = p.current ?? {};
        state.current = {
          latitude: c.latitude ?? null,
          longitude: c.longitude ?? null,
          temperature_2m: c.temperature_2m ?? null,
          apparent_temperature: c.apparent_temperature ?? null,
          relative_humidity_2m: c.relative_humidity_2m ?? null,
          wind_speed_10m: c.wind_speed_10m ?? null,
          precipitation: c.precipitation ?? null,
          is_day: c.is_day ?? 1,
        };

        // Flat polja
        if (p.city != null) state.city = p.city;
        if (p.country != null) state.country = p.country;
        if (p.temperature != null) state.temperature = p.temperature;
        if (p.is_day != null) state.is_day = p.is_day;
        if (p.day != null) state.day = p.day;
        if (p.month != null) state.month = p.month;
        if (p.year != null) state.year = p.year;
        if (p.dayName != null) state.dayName = p.dayName;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message ?? "Fetch failed";
      });
  },
});

export const { clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
