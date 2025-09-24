import { Component } from "react";
import GetWeatherLocation from "../api/apiWeather";
import ico_suny from "../assets/icon-sunny.webp";
import ico_night from "../assets/icon-overcast.webp";
export default class WeatherInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      temperature: 0,
      day: 0,
      month: 0,
      year: 0,
      dayName: "null",
      country: "none",
      city: "none",
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    GetWeatherLocation("Belgrade").then((w) => {
      // primer: pretpostavljam da api vraća daily.time kao string datuma
      const date = new Date(w.daily.time[0]);
      this.setState({
        is_day: w.current.is_day,
        temperature: w.current.temperature_2m, // zameni pravim poljem iz API-ja
        day: date.getDate(),
        month: date.toLocaleString("en-US", { month: "short" }),
        year: date.getFullYear(),
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        country: w.country ?? "Serbia",
        city: w.city ?? "Belgrade",
      });
    });
  };

  render() {
    const { temperature, day, month, year, dayName, country, city, is_day } =
      this.state;

    return (
      <div className="from-[#4658D9] bg-linear-60 to-[#2B1B9C] bg-[url('bg-today-large.svg')] bg-no-repeat bg-cover flex items-center justify-between px-5 rounded-3xl">
        <div className="location">
          <h2 className="text-2xl">
            {city}, {country}
          </h2>
          <p>
            {dayName}, {month} {day}, {year}
          </p>
        </div>
        <div className="temperature flex items-center">
          <div className="image w-30">
            {is_day ? <img src={ico_suny}></img> : <img src={ico_night}></img>}
          </div>

          <h1 className="text-6xl">{Math.round(temperature)}°C</h1>
        </div>
      </div>
    );
  }
}
