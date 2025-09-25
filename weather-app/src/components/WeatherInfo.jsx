import { Component } from "react";
import { connect } from "react-redux";
import ico_suny from "../assets/icon-sunny.webp";
import ico_night from "../assets/icon-overcast.webp";
import store from "../app/store";
class WeatherInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { city, country, temperature, is_day, day, month, year, dayName } =
      this.props;

    return (
      <div className="bg-gradient-to-tr from-[#4658D9] to-[#2B1B9C] bg-[url('/bg-today-large.svg')] bg-no-repeat bg-cover flex items-center rounded-2xl justify-between px-5 py-10">
        <div className="location">
          <h2 className="text-2xl font-semibold">
            {city}, {country}
          </h2>
          <p className="opacity-90">
            {dayName}, {month} {day}, {year}
          </p>
        </div>

        <div className="temperature flex items-center">
          <div className="image">
            {is_day ? (
              <img src={ico_suny} alt="Sunny" />
            ) : (
              <img src={ico_night} alt="Night" />
            )}
          </div>
          <h1 className="text-4xl leading-none font-bold text-center ">
            {Math.round(temperature ?? 0)}
            {"  "}
            {store.getState().metricTemperature.value}
          </h1>
        </div>
      </div>
    );
  }
}

// direktno mapStateToProps bez selektora
const mapStateToProps = (state) => {
  const celisus = store.getState().weather.temperature;
  const fahren = (celisus * 9) / 5 + 32;
  return {
    city: state.weather.city,
    country: state.weather.country,
    temperature:
      store.getState().metricTemperature.value == "°C" ? celisus : fahren,
    is_day: state.weather.is_day,
    day: state.weather.day,
    month: state.weather.month,
    year: state.weather.year,
    dayName: state.weather.dayName,
    status: state.weather.status,
    error: state.weather.error,
  };
};

export default connect(mapStateToProps)(WeatherInfo);
