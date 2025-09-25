import { Component } from "react";
import { connect } from "react-redux";
import icon_dropdown from "../assets/icon-dropdown.svg";
import { changeDay } from "../app/daySlice";

const DAYS_FULL = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};
const NAMES = Object.keys(DAYS_FULL);

class SettingsDay extends Component {
  state = { menu: false };

  toggleMenu = () => this.setState((s) => ({ menu: !s.menu }));

  selectDay = (dayName) => {
    const num = DAYS_FULL[dayName];
    this.props.changeDay(num);
    this.setState({ menu: false });
    this.props.onChange?.(num);
  };

  render() {
    const { menu } = this.state;
    const { dayNumber } = this.props;
    const dayIndex = Math.max(0, Math.min(6, (Number(dayNumber) || 1) - 1));
    const dayName = NAMES[dayIndex] ?? "Monday";

    return (
      <div className="box flex flex-col items-center ml-5 w-fit rounded-lg bg-[#302F4A] relative">
        {/* header */}
        <button
          type="button"
          id="day-selector"
          className="selected flex items-center justify-between gap-3 w-full px-3 py-2 cursor-pointer"
          onClick={this.toggleMenu}
          aria-haspopup="listbox"
          aria-expanded={menu}
          aria-labelledby="day-selector"
        >
          <p>{dayName}</p>
          <img src={icon_dropdown} alt="toggle day menu" />
        </button>

        {/* menu */}
        {menu && (
          <div className="w-full absolute top-full left-0 z-50 mt-1">
            <ul
              role="listbox"
              aria-labelledby="day-selector"
              className="flex flex-col gap-2 border-2 border-[#302F4A] rounded-lg bg-[#232540] py-2 shadow-lg"
            >
              {NAMES.map((d) => {
                const active = d === dayName;
                return (
                  <li key={d}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={[
                        "px-3 py-1 w-full text-left rounded-lg cursor-pointer transition",
                        active
                          ? "bg-[#302F4A] text-white"
                          : "hover:bg-[#302F4A]/50 hover:text-white",
                      ].join(" ")}
                      onClick={() => this.selectDay(d)}
                    >
                      {d}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

const mapState = (state) => ({
  dayNumber: state.dayName?.value ?? 1, // konzistentno sa vašim store-om
});

export default connect(mapState, { changeDay })(SettingsDay);
