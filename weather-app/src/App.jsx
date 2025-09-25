import "./App.css";
// App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchWeather } from "./app/weatherSlice";
import WeatherInfo from "./components/WeatherInfo";
import WeatherInfoMore from "./components/WeatherInfoMore";
import DailyForecast from "./components/DailyForecast";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWeather("Belgrade")); // ← MORA da postoji
  }, [dispatch]);

  return (
    <>
      <WeatherInfo></WeatherInfo>
      <WeatherInfoMore></WeatherInfoMore>
      <DailyForecast index={0}></DailyForecast>
      <DailyForecast index={1}></DailyForecast>
      <DailyForecast index={2}></DailyForecast>
      <DailyForecast index={3}></DailyForecast>
      <DailyForecast index={4}></DailyForecast>
      <DailyForecast index={5}></DailyForecast>
      <DailyForecast index={6}></DailyForecast>
    </>
  );
}
