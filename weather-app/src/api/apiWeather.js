// api/apiWeather.js
import { fetchWeatherApi } from "openmeteo";

// --- helper: geokodiranje ---
async function getGeo(location) {
  if (!location) throw new Error("Location is required");
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    location
  )}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) throw new Error("Location not found");
  return data.results[0]; // { name, latitude, longitude, country_code, ... }
}

// --- minimal helper za temperaturu (koristi se u thunk-u) ---
export async function getTemperature(location) {
  const { latitude, longitude } = await getGeo(location);

  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: [latitude],
    longitude: [longitude],
    timezone: "auto",
    current: ["temperature_2m"],
    forecast_days: 7,
    temperature_unit: "celsius",
  };

  const [resp] = await fetchWeatherApi(url, params);
  const curr = resp?.current?.();
  const temp = curr ? curr.variables(0).value() : null;

  return { latitude, longitude, temperature: temp };
}

// --- pun helper sa svim poljima koja očekuješ u Redux-u ---
export default async function GetWeatherLocation(arg_location) {
  const { latitude, longitude, name, country_code } = await getGeo(
    arg_location
  );

  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: [latitude],
    longitude: [longitude],
    timezone: "auto",

    // CURRENT — redosled indeksa MORA da se poklapa sa variables(i) ispod
    current: [
      "temperature_2m", // idx 0
      "is_day", // idx 1
      "wind_speed_10m", // idx 2
      "relative_humidity_2m", // idx 3
      "precipitation", // idx 4
    ],

    // HOURLY — koristimo za fallback temperature
    hourly: ["temperature_2m"],

    // DAILY — DODATO: snowfall_sum, showers_sum, rain_sum (redosled -> indices)
    daily: [
      "weather_code", // 0
      "temperature_2m_max", // 1
      "temperature_2m_min", // 2
      "snowfall_sum", // 3 (cm)
      "showers_sum", // 4 (mm)
      "rain_sum", // 5 (mm)
    ],

    // MINUTELY_15 — ostaje isto
    minutely_15: [
      "wind_speed_10m",
      "temperature_2m",
      "is_day",
      "wind_gusts_10m",
    ],

    past_days: 0,
    forecast_days: 7,

    // Jedinice da sve dobijemo "lepo"
    windspeed_unit: "kmh",
    precipitation_unit: "mm",
    temperature_unit: "celsius",
  };

  const [response] = await fetchWeatherApi(url, params);
  const offset = response.utcOffsetSeconds?.() ?? 0;

  // --- CURRENT ---
  const current = response.current?.();
  const hasCurrent = !!current && Number.isFinite(Number(current.time?.()));
  const currentTime = hasCurrent
    ? new Date((Number(current.time()) + offset) * 1000)
    : null;

  let currentBlock = null;
  if (hasCurrent) {
    currentBlock = {
      time: currentTime,
      time_iso: currentTime.toISOString(),
      temperature_2m: current.variables(0).value(),
      is_day: current.variables(1).value(),
      wind_speed_10m: current.variables(2).value(), // km/h
      relative_humidity_2m: current.variables(3).value(), // %
      precipitation: current.variables(4).value(), // mm
    };
  }

  // --- HOURLY (fallback) ---
  const hourly = response.hourly?.();
  const hStart = Number(hourly?.time?.() ?? 0);
  const hEnd = Number(hourly?.timeEnd?.() ?? 0);
  const hStep = Number(hourly?.interval?.() ?? 0);
  const hLen = hStep > 0 ? Math.max(0, Math.floor((hEnd - hStart) / hStep)) : 0;

  const hourlyTime =
    hLen > 0
      ? Array.from(
          { length: hLen },
          (_, i) => new Date((hStart + i * hStep + offset) * 1000)
        )
      : [];
  const hourlyTemp = hourly?.variables?.(0)?.valuesArray?.() ?? [];

  if (
    !currentBlock &&
    hourlyTime.length > 0 &&
    hourlyTemp.length === hourlyTime.length
  ) {
    const now = Date.now();
    let bestIdx = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < hourlyTime.length; i++) {
      const diff = Math.abs(hourlyTime[i].getTime() - now);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }
    currentBlock = {
      time: hourlyTime[bestIdx],
      time_iso: hourlyTime[bestIdx].toISOString(),
      temperature_2m: hourlyTemp[bestIdx],
      is_day:
        hourlyTime[bestIdx].getHours() >= 6 &&
        hourlyTime[bestIdx].getHours() < 20
          ? 1
          : 0,
      wind_speed_10m: null,
      relative_humidity_2m: null,
      precipitation: null,
      _fallback_from_hourly: true,
    };
  }

  // --- DAILY ---
  const daily = response.daily?.();
  const dStart = Number(daily?.time?.() ?? 0);
  const dEnd = Number(daily?.timeEnd?.() ?? 0);
  const dStep = Number(daily?.interval?.() ?? 0);
  const dLen = dStep > 0 ? Math.max(0, Math.floor((dEnd - dStart) / dStep)) : 0;

  const dailyTime =
    dLen > 0
      ? Array.from(
          { length: dLen },
          (_, i) => new Date((dStart + i * dStep + offset) * 1000)
        )
      : [];

  const dailyWeatherCode = daily?.variables?.(0)?.valuesArray?.() ?? [];
  const dailyTempMax = daily?.variables?.(1)?.valuesArray?.() ?? [];
  const dailyTempMin = daily?.variables?.(2)?.valuesArray?.() ?? [];
  const dailySnowfallSum = daily?.variables?.(3)?.valuesArray?.() ?? []; // cm
  const dailyShowersSum = daily?.variables?.(4)?.valuesArray?.() ?? []; // mm
  const dailyRainSum = daily?.variables?.(5)?.valuesArray?.() ?? []; // mm

  // --- MINUTELY_15 ---
  const m15 = response.minutely15?.();
  const mStart = Number(m15?.time?.() ?? 0);
  const mEnd = Number(m15?.timeEnd?.() ?? 0);
  const mStep = Number(m15?.interval?.() ?? 0);
  const mLen = mStep > 0 ? Math.max(0, Math.floor((mEnd - mStart) / mStep)) : 0;

  const m15Time =
    mLen > 0
      ? Array.from(
          { length: mLen },
          (_, i) => new Date((mStart + i * mStep + offset) * 1000)
        )
      : [];

  return {
    meta: {
      latitude,
      longitude,
      location_name: name ?? arg_location,
      country_code: country_code ?? null,
      timezone_offset_seconds: offset,
    },

    current: currentBlock, // uvek postoji (pravi ili fallback)

    hourly: {
      time: hourlyTime,
      temperature_2m: hourlyTemp,
    },

    daily: {
      time: dailyTime,
      weather_code: dailyWeatherCode,
      temperature_2m_max: dailyTempMax,
      temperature_2m_min: dailyTempMin,
      snowfall_sum: dailySnowfallSum, // cm
      showers_sum: dailyShowersSum, // mm
      rain_sum: dailyRainSum, // mm
    },

    minutely15: {
      time: m15Time,
      wind_speed_10m: m15?.variables?.(0)?.valuesArray?.() ?? [],
      temperature_2m: m15?.variables?.(1)?.valuesArray?.() ?? [],
      is_day: m15?.variables?.(2)?.valuesArray?.() ?? [],
      wind_gusts_10m: m15?.variables?.(3)?.valuesArray?.() ?? [],
    },

    time: hourlyTime, // zgodno za grafove
  };
}
