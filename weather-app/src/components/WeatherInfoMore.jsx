// src/components/WeatherInfoMore.jsx
import { Component } from "react";
import { connect } from "react-redux";

class WeatherInfoMore extends Component {
  renderCard(label, value, metric) {
    return (
      <div className="bg-[#302F4A] rounded-lg p-4 flex flex-col gap-1 weather-card ">
        <h2 className="text-sm opacity-80">{label}</h2>
        <p className="text-2xl font-semibold">
          {value !== null && value !== undefined ? value : "—"}
          {metric ?? ""}
        </p>
      </div>
    );
  }

  render() {
    const {
      metric,
      humidity,
      wind,
      feelsLike,
      precipitation,
      speedUnit,
      temperatureUnit,
      precipitationUnit,
    } = this.props;

    switch (metric) {
      case "humidity":
        return this.renderCard("Humidity", humidity, "%");

      case "wind":
        return this.renderCard("Wind", wind, ` ${speedUnit}`);

      case "feelsLike":
        return this.renderCard("Feels like", feelsLike, ` ${temperatureUnit}`);

      case "precipitation":
        return this.renderCard(
          "Precipitation",
          precipitation,
          ` ${precipitationUnit}`
        );

      default:
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {this.renderCard("Humidity", humidity, "%")}
            {this.renderCard("Wind", wind, ` ${speedUnit}`)}
            {this.renderCard("Feels like", feelsLike, ` ${temperatureUnit}`)}
            {this.renderCard(
              "Precipitation",
              precipitation,
              ` ${precipitationUnit}`
            )}
          </div>
        );
    }
  }
}

const mapStateToProps = (state) => {
  const cur = state.weather?.current ?? {};

  const celsius = Math.round(state.weather?.current?.temperature_2m) ?? null;
  const fahren = celsius != null ? Math.round((celsius * 9) / 5 + 32) : null;

  const speedKmh = Math.round(cur?.wind_speed_10m) ?? null;
  const speedMph = speedKmh != null ? Math.round(speedKmh * 0.621371192) : null;

  const precipitationMM = state.weather?.current?.precipitation ?? 0;
  const precipitationIN =
    precipitationMM != null ? (precipitationMM / 25.4).toFixed(2) : "0.00";

  console.log("Full state:", state);
  console.log("Preception state:", state.preception);
  console.log("PrecipitationMM:", precipitationMM);
  console.log("PrecipitationIN:", precipitationIN);
  console.log("Selected unit:", state.preception?.value);

  return {
    humidity: cur?.relative_humidity_2m ?? null,
    wind: state.metricSpeed?.value === "kmh" ? speedKmh : speedMph,
    feelsLike: state.metricTemperature?.value === "°C" ? celsius : fahren,
    precipitation:
      state.preception?.value === "in" ? precipitationIN : precipitationMM,
    speedUnit: state.metricSpeed?.value ?? "kmh",
    temperatureUnit: state.metricTemperature?.value ?? "°C",
    precipitationUnit: state.preception?.value ?? "mm",
  };
};

export default connect(mapStateToProps)(WeatherInfoMore);
