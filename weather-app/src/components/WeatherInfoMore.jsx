// src/components/WeatherInfoMore.jsx
import { Component } from "react";
import { connect } from "react-redux";

function formatNumber(v, digits = 0) {
  if (v == null || Number.isNaN(Number(v))) return "—";
  return Number(v).toFixed(digits);
}

class WeatherInfoMore extends Component {
  renderCard(label, value, unit = "", digits = 0) {
    const display =
      value == null ? "—" : `${formatNumber(value, digits)}${unit}`;
    return (
      <div className="bg-[#302F4A] rounded-lg p-4 flex flex-col gap-1 min-w-44">
        <h2 className="text-sm opacity-80">{label}</h2>
        <p className="text-2xl font-semibold">{display}</p>
      </div>
    );
  }

  render() {
    const { metric, humidity, wind, feelsLike, precipitation } = this.props;

    // Ako je prosleđen metric -> prikaži samo jednu karticu
    switch (metric) {
      case "humidity":
        return this.renderCard("Humidity", humidity, "%", 0);
      case "wind":
        return this.renderCard("Wind", wind, " km/h", 0);
      case "feelsLike":
        return this.renderCard("Feels like", feelsLike, "°C", 1);
      case "precipitation":
        return this.renderCard("Precipitation", precipitation, " mm", 1);
      default:
        // Ako metric nije prosleđen -> prikaži sve četiri
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <h1>Prosledite parametre</h1>
          </div>
        );
    }
  }
}

const mapStateToProps = (state) => {
  const cur = state.weather?.current ?? {};
  return {
    humidity: cur?.relative_humidity_2m ?? null,
    wind: cur?.wind_speed_10m ?? null, // km/h ako si stavio windspeed_unit: "kmh"
    feelsLike: cur?.apparent_temperature ?? state.weather?.temperature ?? null,
    precipitation: cur?.precipitation ?? null,
  };
};

export default connect(mapStateToProps)(WeatherInfoMore);
export { WeatherInfoMore };
