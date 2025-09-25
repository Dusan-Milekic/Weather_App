import "./App.css";
// App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchWeather } from "./app/weatherSlice";
import SearchBar from "./components/SearchBar";
import WeatherInfo from "./components/WeatherInfo";
import WeatherInfoMore from "./components/WeatherInfoMore";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import SettingsDay from "./components/SettingsDay";
import Settings from "./components/Settings";
import icon_logo from "./assets/logo.svg";

import store from "./app/store";
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWeather("Belgrade")); // ← MORA da postoji
  }, [dispatch]);
  console.log("DAN: ", store.getState().dayName.value);
  return (
    <>
      <header className="flex justify-between py-7 px-5 max-w-7xl mx-auto">
        <div className="logo">
          <img src={icon_logo} alt="logo" />
        </div>
        <Settings></Settings>
      </header>

      <SearchBar></SearchBar>

      <h1 id="h1" className="mt-8 text-6xl text-center font-bold">
        How's the sky looking today
      </h1>

      <div className="xl:flex xl:gap-10 max-w-7xl mx-auto">
        <main className="xl:flex-2">
          <div className="info my-8 ">
            <WeatherInfo></WeatherInfo>
          </div>

          <WeatherInfoMore></WeatherInfoMore>
          <h2 className="text-3xl mt-18 font-bold">Daily forecast</h2>
          <div className="daily grid grid-cols-3 sm:grid-cols-7 gap-2 my-8">
            <DailyForecast index={0}></DailyForecast>
            <DailyForecast index={1}></DailyForecast>
            <DailyForecast index={2}></DailyForecast>
            <DailyForecast index={3}></DailyForecast>
            <DailyForecast index={4}></DailyForecast>
            <DailyForecast index={5}></DailyForecast>
            <DailyForecast index={6}></DailyForecast>
          </div>
          <div className="horuly px-3 bg-[#262540] py-3  rounded-3xl xl:hidden">
            <header className="flex items-center  justify-between my-2">
              <h2 className="text-lg">Horuly forecast</h2>
              <SettingsDay></SettingsDay>
            </header>
            <div className="body">
              <HourlyForecast />
            </div>
          </div>
        </main>
        <div className="horuly px-3 bg-[#262540] py-3 rounded-3xl hidden xl:block my-8 flex-1">
          <header className="flex items-center  justify-between my-2">
            <h2 className="text-lg font-bold">Horuly forecast</h2>
            <SettingsDay></SettingsDay>
          </header>
          <div className="body">
            <HourlyForecast />
          </div>
        </div>
      </div>
    </>
  );
}
/* <WeatherInfo></WeatherInfo>
      <WeatherInfoMore></WeatherInfoMore>
      <DailyForecast index={0}></DailyForecast>
      <HourlyForecast dayIndex={0}></HourlyForecast>
      <hr />*/
