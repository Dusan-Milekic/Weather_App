import "./App.css";
// App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchWeather } from "./app/weatherSlice";
import WeatherInfo from "./components/WeatherInfo";
import WeatherInfoMore from "./components/WeatherInfoMore";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWeather("Belgrade")); // ← MORA da postoji
  }, [dispatch]);

  return (
    <>
      <WeatherInfo />
      <WeatherInfoMore metric="humidity"></WeatherInfoMore>
      <WeatherInfoMore metric="wind"></WeatherInfoMore>
      <WeatherInfoMore metric="feelsLike"></WeatherInfoMore>
      <WeatherInfoMore metric="precipitation"></WeatherInfoMore>
    </>
  );
}
