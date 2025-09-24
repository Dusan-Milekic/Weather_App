import { Component } from "react";
import GetWeatherLocation from "../api/apiWeather";
import ico_suny from "../assets/icon-sunny.webp";
import ico_night from "../assets/icon-overcast.webp";

export default class WeatherInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: 0,
      is_day: 1, // 1=day, 0=night (Open-Meteo tako vraća)
      day: 0,
      month: "", // npr. "Sep"
      year: 0,
      dayName: "", // npr. "Tuesday"
      country: "Serbia",
      city: "Belgrade",
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const w = await GetWeatherLocation("Belgrade");

      // daily.time[0] kod nas je niz Date-ova; ipak robustno:
      const first = w?.daily?.time?.[0];
      const date = first instanceof Date ? first : new Date(first);

      this.setState({
        is_day: Number(w?.current?.is_day) || 0,
        temperature: Number(w?.current?.temperature_2m) || 0,
        day: date.getDate(),
        month: date.toLocaleString("en-US", { month: "short" }), // "Sep"
        year: date.getFullYear(),
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }), // "Tuesday"
        country: w?.meta?.country_code ?? "Serbia",
        city: w?.meta?.location_name ?? "Belgrade",
      });
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  };

  render() {
    const { temperature, day, month, year, dayName, country, city, is_day } =
      this.state;

    return (
      <div className="bg-gradient-to-tr from-[#4658D9] to-[#2B1B9C] bg-[url('/bg-today-large.svg')] bg-no-repeat bg-cover flex items-center justify-between px-5 py-10">
        <div className="location">
          <h2 className="text-2xl font-semibold">
            {city}, {country}
          </h2>
          <p className="opacity-90">
            {dayName}, {month} {day}, {year}
          </p>
        </div>

        <div className="temperature flex items-center gap-4">
          <div className="image w-[64px] h-[64px] shrink-0">
            {is_day ? (
              <img
                src={ico_suny}
                alt="Sunny"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={ico_night}
                alt="Night"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <h1 className="text-6xl leading-none font-bold">
            {Math.round(temperature)}°C
          </h1>
        </div>
      </div>
    );
  }
}
