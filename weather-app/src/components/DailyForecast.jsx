// src/components/DailyForecast.jsx
import { Component } from "react";
import { connect } from "react-redux";

import icon_drizzle from "../assets/icon-drizzle.webp";
import icon_fog from "../assets/icon-fog.webp";
import icon_overcast from "../assets/icon-overcast.webp";
import icon_cloudy from "../assets/icon-partly-cloudy.webp";
import icon_rain from "../assets/icon-rain.webp";
import icon_snow from "../assets/icon-snow.webp";
import icon_storm from "../assets/icon-storm.webp";
import icon_sunny from "../assets/icon-sunny.webp";

function formatTemp(v) {
  if (v == null || Number.isNaN(Number(v))) return "—";
  return `${Math.round(Number(v))}°`;
}

// WMO code -> ikonica
function iconFromWeatherCode(code, isDay = 1) {
  if (code == null) return icon_overcast;
  if (code === 0) return isDay ? icon_sunny : icon_overcast;
  if (code === 1) return isDay ? icon_sunny : icon_overcast;
  if (code === 2) return icon_cloudy;
  if (code === 3) return icon_overcast;
  if (code === 45 || code === 48) return icon_fog;
  if (code >= 51 && code <= 57) return icon_drizzle; // drizzle
  if (code >= 61 && code <= 67) return icon_rain; // rain / freezing rain
  if (code >= 71 && code <= 77) return icon_snow; // snow
  if (code >= 80 && code <= 82) return icon_drizzle; // rain showers
  if (code === 85 || code === 86) return icon_snow; // snow showers
  if (code >= 95 && code <= 99) return icon_storm; // thunder
  return icon_overcast;
}

function RenderForecast(icon, dayName, minTemp, maxTemp) {
  return (
    <div className="flex flex-col max-w-40 px-8">
      <div className="box flex-col">
        <h2 className="text-center">{dayName ?? ""}</h2>
        <img src={icon} alt="forecast icon" />
      </div>
      <div className="flex justify-between">
        <p>{formatTemp(minTemp)}</p>
        <p>{formatTemp(maxTemp)}</p>
      </div>
    </div>
  );
}

class DailyForecast extends Component {
  render() {
    const { dayName, minTemp, maxTemp, weatherCode, is_day = 1 } = this.props;
    const icon = iconFromWeatherCode(weatherCode, is_day);
    return RenderForecast(icon, dayName, minTemp, maxTemp);
  }
}

// ---- Redux povezivanje ----
const mapStateToProps = (state, ownProps) => {
  const d = state.weather?.daily ?? {};

  // Dozvoli index, i (i eventualno typo 'indes')
  const iRaw = ownProps.index ?? ownProps.i ?? ownProps.indes ?? 0;
  const i = Number.isFinite(Number(iRaw)) ? Number(iRaw) : 0;

  // Helper: radi za Array i za TypedArray
  const pick = (arr) =>
    (Array.isArray(arr) || ArrayBuffer.isView(arr)) && arr.length > i
      ? arr[i]
      : null;

  // time -> Date -> "Mon"/"Tue"/...
  const dateVal = pick(d.time);
  const date =
    dateVal instanceof Date ? dateVal : dateVal ? new Date(dateVal) : null;

  const dayName = date
    ? date.toLocaleDateString("en-US", { weekday: "short" })
    : "";

  // UZMI VREDNOSTI ZA i-ti DAN
  const minTemp = pick(d.temperature_2m_min);
  const maxTemp = pick(d.temperature_2m_max);
  const weatherCode = pick(d.weather_code);

  return {
    dayName,
    minTemp,
    maxTemp,
    weatherCode,
    is_day: state.weather?.current?.is_day ?? 1,
  };
};

export default connect(mapStateToProps)(DailyForecast);
