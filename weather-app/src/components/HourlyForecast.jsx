import { Component } from "react";
import { connect } from "react-redux";
import icon_overcast from "../assets/icon-overcast.webp";
import icon_sunny from "../assets/icon-sunny.webp";
import store from "../app/store";

function HourCard({ ts, temp }) {
  const d = ts instanceof Date ? ts : new Date(ts);
  const hour = d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  const h = d.getHours();
  const icon = h >= 6 && h < 20 ? icon_sunny : icon_overcast;

  return (
    <div className="bg-[#302F4A] rounded-lg flex items-center  justify-between py-3 px-4 mt-2">
      <div className="flex items-center gap-2">
        <img src={icon} alt="hour" className="h-10 w-10" />
        <p className="text-xs  font-bold">{hour}</p>
      </div>
      <p className="text-base font-semibold">
        {temp == null || isNaN(temp) ? "—" : `${Math.round(temp)}°`}
      </p>
    </div>
  );
}

class HourlyForecast extends Component {
  render() {
    const { hours } = this.props;

    if (!hours || hours.length === 0) {
      return <p className="opacity-80">No hourly data available.</p>;
    }

    return (
      <div className="flex flex-col overflow-auto h-[580px]">
        {hours.map((hour, index) => (
          <HourCard key={index} ts={hour.time} temp={hour.temperature} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // 1. Uzmi izabrani dan (1-7, gde je 1=Monday)
  const selectedDay = state.dayName?.value || 1;

  // 2. Uzmi weather podatke
  const hourlyData = state.weather?.hourly || {};
  const times = hourlyData.time || [];
  const temperatures = hourlyData.temperature_2m || [];

  // 3. Ako nema podataka, vrati prazan niz
  if (!times.length || !temperatures.length) {
    return { hours: [] };
  }

  // 4. Filtriraj po danu nedelje
  const hours = [];
  for (let i = 0; i < times.length && i < temperatures.length; i++) {
    const timeEntry = times[i];
    const date = timeEntry instanceof Date ? timeEntry : new Date(timeEntry);

    // Proveri dan nedelje (1=Monday, 7=Sunday)
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

    if (dayOfWeek === selectedDay) {
      // Konvertuj temperaturu ako treba
      const metric = store.getState().metricTemperature.value;
      let temp = temperatures[i];

      // Konvertuj SAMO ako je metric eksplicitno postavljen na F
      if (metric === "°F" && temp != null && !isNaN(temp)) {
        temp = (temp * 9) / 5 + 32; // Convert to Fahrenheit
      }

      hours.push({
        time: date,
        temperature: temp,
      });
    }
  }

  // 5. Sortiraj po vremenu
  hours.sort((a, b) => a.time - b.time);

  return { hours };
};

export default connect(mapStateToProps)(HourlyForecast);
