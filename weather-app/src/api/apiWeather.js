import { fetchWeatherApi } from "openmeteo";

async function getGeo(location) {
  if (!location) throw new Error("Location is required");
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    location
  )}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) throw new Error("Location not found");
  return data.results[0];
}

export async function getTemperature(location) {
  const { latitude, longitude } = await getGeo(location);
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: [latitude],
    longitude: [longitude],
    timezone: "auto",
    current: ["temperature_2m"],
    forecast_days: 1, // osigurava da je "sada" u dometu
  };
  const [resp] = await fetchWeatherApi(url, params);
  const t = resp?.current()?.variables(0)?.value();
  return { latitude, longitude, temperature: t ?? null };
}

export default async function GetWeatherLocation(arg_location) {
  const { latitude, longitude, name, country_code } = await getGeo(
    arg_location
  );

  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: [latitude],
    longitude: [longitude],
    timezone: "auto",
    // tražimo i current i hourly (fallback)
    current: ["temperature_2m", "is_day", "wind_speed_10m"],
    hourly: ["temperature_2m"],
    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
    minutely_15: [
      "wind_speed_10m",
      "temperature_2m",
      "is_day",
      "wind_gusts_10m",
    ],
    past_days: 0,
    forecast_days: 1,
  };

  const [response] = await fetchWeatherApi(url, params);
  const offset = response.utcOffsetSeconds();

  // -- CURRENT --
  const current = response.current();
  const hasCurrent = !!current && Number.isFinite(Number(current.time()));

  const currentTime = hasCurrent
    ? new Date((Number(current.time()) + offset) * 1000)
    : null;

  const currentBlock = hasCurrent
    ? {
        time: currentTime,
        time_iso: currentTime.toISOString(),
        temperature_2m: current.variables(0).value(),
        is_day: current.variables(1).value(),
        wind_speed_10m: current.variables(2).value(),
      }
    : null;

  // -- HOURLY (fallback + graf) --
  const hourly = response.hourly();
  const hStart = Number(hourly.time());
  const hEnd = Number(hourly.timeEnd());
  const hStep = hourly.interval();
  const hLen = (hEnd - hStart) / hStep;

  const hourlyTime = Array.from(
    { length: hLen },
    (_, i) => new Date((hStart + i * hStep + offset) * 1000)
  );
  const hourlyTemp = hourly.variables(0).valuesArray();

  // Ako current fali, uzmi najbliži sat kao “pseudo-current”
  let effectiveCurrent = currentBlock;
  if (!effectiveCurrent && hourlyTime.length > 0) {
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
    effectiveCurrent = {
      time: hourlyTime[bestIdx],
      time_iso: hourlyTime[bestIdx].toISOString(),
      temperature_2m: hourlyTemp[bestIdx],
      // heuristike za fallback:
      is_day:
        hourlyTime[bestIdx].getHours() >= 6 &&
        hourlyTime[bestIdx].getHours() < 20
          ? 1
          : 0,
      wind_speed_10m: null,
      _fallback_from_hourly: true,
    };
  }

  // -- DAILY --
  const daily = response.daily();
  const dStart = Number(daily.time());
  const dEnd = Number(daily.timeEnd());
  const dStep = daily.interval();
  const dLen = (dEnd - dStart) / dStep;

  const dailyTime = Array.from(
    { length: dLen },
    (_, i) => new Date((dStart + i * dStep + offset) * 1000)
  );

  // -- MINUTELY_15 --
  const m15 = response.minutely15();
  const mStart = Number(m15.time());
  const mEnd = Number(m15.timeEnd());
  const mStep = m15.interval();
  const mLen = (mEnd - mStart) / mStep;

  const m15Time = Array.from(
    { length: mLen },
    (_, i) => new Date((mStart + i * mStep + offset) * 1000)
  );

  return {
    meta: {
      latitude,
      longitude,
      location_name: name ?? arg_location,
      country_code: country_code ?? null,
      timezone_offset_seconds: offset,
    },
    current: effectiveCurrent, // <-- SADA UVEK IMAŠ “trenutno vreme” (pravo ili fallback)
    hourly: {
      time: hourlyTime,
      temperature_2m: hourlyTemp,
    },
    daily: {
      time: dailyTime,
      weather_code: daily.variables(0).valuesArray(),
      temperature_2m_max: daily.variables(1).valuesArray(),
      temperature_2m_min: daily.variables(2).valuesArray(),
    },
    minutely15: {
      time: m15Time,
      wind_speed_10m: m15.variables(0).valuesArray(),
      temperature_2m: m15.variables(1).valuesArray(),
      is_day: m15.variables(2).valuesArray(),
      wind_gusts_10m: m15.variables(3).valuesArray(),
    },
    // zgodan “flat” za graf
    time: hourlyTime,
  };
}
