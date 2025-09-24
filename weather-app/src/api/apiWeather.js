import { fetchWeatherApi } from "openmeteo";

/** Geocoding preko REST endpointa */
async function getGeo(location) {
  if (!location) throw new Error("Location is required");
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    location
  )}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) throw new Error("Location not found");
  return data.results[0]; // { name, latitude, longitude, ... }
}

/** Trenutna temperatura (current) preko Open-Meteo SDK */
export async function getTemperature(location) {
  const { latitude, longitude } = await getGeo(location);

  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: [latitude],
    longitude: [longitude],
    current: "temperature_2m",
    timezone: "auto",
  };

  const [resp] = await fetchWeatherApi(url, params);
  const temperature = resp.current()?.variables(0)?.value(); // °C

  return { latitude, longitude, temperature };
}

/** Default: uzmi HOURLY temperaturu i ispiši niz vremena i vrednosti */
export default async function GetWeatherLocation(arg_location) {
  const { latitude, longitude } = await getGeo(arg_location);

  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: [latitude],
    longitude: [longitude],
    hourly: "temperature_2m",
    timezone: "auto",
  };

  const [response] = await fetchWeatherApi(url, params);

  // Meta
  const lat = response.latitude();
  const lon = response.longitude();
  const elevation = response.elevation();
  const utcOffsetSeconds = response.utcOffsetSeconds();

  console.log(
    `Coordinates: ${lat}° ${lon}°`,
    `\nElevation: ${elevation} m`,
    `\nUTC offset (s): ${utcOffsetSeconds}`
  );

  // Hourly podaci
  const hourly = response.hourly();
  const start = Number(hourly.time());
  const end = Number(hourly.timeEnd());
  const step = hourly.interval();

  const time = Array.from(
    { length: (end - start) / step },
    (_, i) => new Date((start + i * step + utcOffsetSeconds) * 1000)
  );
  const temperature_2m = hourly.variables(0).valuesArray();

  const weatherData = { hourly: { time, temperature_2m } };
  console.log("Hourly data:", weatherData.hourly);

  return weatherData;
}
