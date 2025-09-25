// src/components/HourlyForecastByDay.jsx
import { Component } from "react";
import { connect } from "react-redux";

import icon_overcast from "../assets/icon-overcast.webp";
import icon_sunny from "../assets/icon-sunny.webp";
// ❌ import store from "../app/store"; // nije potrebno u mapStateToProps

const isArrayLike = (arr) =>
  Array.isArray(arr) || (arr && ArrayBuffer.isView(arr));

const toDate = (v) => (v instanceof Date ? v : v ? new Date(v) : null);

const formatHour = (d) =>
  d ? d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }) : "";

const formatTemp = (v) =>
  v == null || Number.isNaN(Number(v)) ? "—" : `${Math.round(Number(v))}°`;

function HourCard({ date, temp }) {
  const h = date ? date.getHours() : 12;
  const isDay = h >= 6 && h < 20;
  const icon = isDay ? icon_sunny : icon_overcast;

  return (
    <div className="bg-[#302F4A] rounded-lg flex items-center justify-around py-3 mt-2">
      <div className="left flex items-center gap-2">
        <img src={icon} alt="hour" className="h-10 w-10" />
        <p className="text-xs opacity-80">{formatHour(date)}</p>
      </div>
      <div className="flex">
        <p className="text-base font-semibold self-end">{formatTemp(temp)}</p>
      </div>
    </div>
  );
}

class HourlyForecast extends Component {
  render() {
    const { hours } = this.props; // [{time: Date, temp: number}]
    if (!hours || !hours.length) {
      return <p className="opacity-80">No hourly data for this day.</p>;
    }
    return (
      <div className="flex flex-col">
        {hours.map((h, idx) => (
          <HourCard
            key={h.time?.toISOString?.() ?? idx}
            date={h.time}
            temp={h.temp}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const daily = state.weather?.daily ?? {};
  const hourly = state.weather?.hourly ?? {};

  // dan (0 = danas). podrži i alternativna imena propova
  const dayIndexRaw =
    ownProps.dayIndex ?? ownProps.index ?? ownProps.i ?? ownProps.indes ?? 0;
  const dayIndex = Number.isFinite(Number(dayIndexRaw))
    ? Number(dayIndexRaw)
    : 0;

  // ciljna "date" iz daily.time[dayIndex]
  const dayVal =
    isArrayLike(daily.time) && daily.time.length > dayIndex
      ? daily.time[dayIndex]
      : null;
  const dayDate = toDate(dayVal);
  if (!dayDate) return { hours: [] };

  // opseg (00:00 do 24:00) tog dana
  const start = new Date(
    dayDate.getFullYear(),
    dayDate.getMonth(),
    dayDate.getDate(),
    0,
    0,
    0,
    0
  );
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  // vremenske serije
  const hTimes = isArrayLike(hourly.time) ? hourly.time : [];
  const hTempsRaw = isArrayLike(hourly.temperature_2m)
    ? hourly.temperature_2m
    : [];

  // prilagodi temperaturu prema metrikama iz state-a (bez store.getState())
  const useCelsius = state.metricTemperature?.value === "°C";
  const hTemps = useCelsius
    ? hTempsRaw
    : hTempsRaw.map((t) =>
        t == null || Number.isNaN(Number(t)) ? t : (Number(t) * 9) / 5 + 32
      );

  // izdvoji sve sate koji pripadaju tom danu
  const hours = [];
  const len = Math.min(hTimes.length, hTemps.length);
  for (let i = 0; i < len; i++) {
    const t = toDate(hTimes[i]);
    if (!t) continue;
    if (t >= start && t < end) {
      hours.push({ time: t, temp: hTemps[i] });
    }
  }

  // osiguraj poredak po vremenu (ako već nije)
  hours.sort((a, b) => (a.time?.getTime?.() ?? 0) - (b.time?.getTime?.() ?? 0));

  return { hours };
};

export default connect(mapStateToProps)(HourlyForecast);
