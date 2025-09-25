// src/components/WeatherInfoMore.jsx
import { Component } from "react";
import { connect } from "react-redux";
import store from "../app/store";

class WeatherInfoMore extends Component {
  renderCard(label, value, metric) {
    return (
      <div className="bg-[#302F4A] rounded-lg p-4 flex flex-col gap-1 ">
        <h2 className="text-sm opacity-80">{label}</h2>
        <p className="text-2xl font-semibold">
          {value !== null && value !== undefined ? value : "—"}
          {metric ?? ""}
        </p>
      </div>
    );
  }

  render() {
    const { metric, humidity, wind, feelsLike, precipitation } = this.props;

    console.log("WeatherInfoMore feelsLike:", feelsLike);

    switch (metric) {
      case "humidity":
        return this.renderCard("Humidity", humidity, "%");

      case "wind":
        return this.renderCard(
          "Wind",
          wind,
          ` ${store.getState().metricSpeed.value}`
        );

      case "feelsLike":
        return this.renderCard(
          "Feels like",
          feelsLike,
          ` ${store.getState().metricTemperature.value}`
        );

      case "precipitation":
        return this.renderCard("Precipitation", precipitation, " mm");

      default:
        return (
          <div className="grid grid-cols-2 gap-3">
            {this.renderCard("Humidity", humidity, "%")}
            {this.renderCard(
              "Wind",
              wind,
              ` ${store.getState().metricSpeed.value}`
            )}
            {this.renderCard(
              "Feels like",
              feelsLike,
              ` ${store.getState().metricTemperature.value}`
            )}
            {this.renderCard("Precipitation", precipitation, " mm")}
          </div>
        );
    }
  }
}

const mapStateToProps = (state) => {
  const cur = state.weather?.current ?? {};

  // ispravljena putanja: state.weather.current.apparent_temperature
  const celsius = store.getState().weather.current.temperature_2m ?? null;
  const fahren = celsius != null ? (celsius * 9) / 5 + 32 : null;

  const speedKmh = cur?.wind_speed_10m ?? null;
  const speedMph = speedKmh != null ? speedKmh * 0.621371192 : null;

  console.log(state.metricTemperature?.value);

  return {
    humidity: cur?.relative_humidity_2m ?? null,
    wind: state.metricSpeed?.value === "kmh" ? speedKmh : speedMph,
    feelsLike: state.metricTemperature?.value === "°C" ? celsius : fahren,
    precipitation: cur?.precipitation ?? null,
  };
};

export default connect(mapStateToProps)(WeatherInfoMore);
