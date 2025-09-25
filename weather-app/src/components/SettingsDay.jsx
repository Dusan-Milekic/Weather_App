import { Component } from "react";
import icon_dropdown from "../assets/icon-dropdown.svg";

const DAYS_FULL = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default class SettingsDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      day: "Monday", // start vrednost
    };
  }

  toggleMenu = () => {
    this.setState((prev) => ({ menu: !prev.menu }));
  };

  selectDay = (day) => {
    this.setState({ day, menu: false });
    this.props.onChange?.(day); // ako ti treba callback ka roditelju
  };

  render() {
    const { menu, day } = this.state;

    return (
      <div className="box flex flex-col items-center ml-5  w-fit rounded-lg bg-[#302F4A]">
        {/* header */}
        <button
          type="button"
          className="selected flex items-center justify-between gap-3 w-full px-3 py-2 cursor-pointer"
          onClick={this.toggleMenu}
          aria-haspopup="listbox"
          aria-expanded={menu}
        >
          <p>{day}</p>
          <img src={icon_dropdown} alt="toggle day menu" />
        </button>

        {/* menu */}
        <div className="w-full px-1 relative">
          <ul
            role="listbox"
            className={`flex flex-col gap-2 border-b-2 border-[#302F4A] pb-2 rounded-lg bg-[#232540] py-2 absolute ${
              menu ? "" : "hidden"
            }`}
          >
            {DAYS_FULL.map((d) => {
              const active = d === day;
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
      </div>
    );
  }
}
