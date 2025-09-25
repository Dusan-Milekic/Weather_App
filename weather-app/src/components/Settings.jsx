import { Component, createRef } from "react";
import icon_units from "../assets/icon-units.svg";
import icon_dropdown from "../assets/icon-dropdown.svg";
import store from "../app/store";
import { changeCelsius, changeFahren } from "../app/metrcisSlice";
import { changeKM, changeMPH } from "../app/speedSlice";
export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      toggled: false,
      temperature: "C",
      windSpeed: "km/h",
      precipitation: "mm", // ✅ typo fixed
    };
    this.references = {
      menu: createRef(),
      t1: createRef(),
      t2: createRef(),
      s1: createRef(),
      s2: createRef(),
      p1: createRef(),
      p2: createRef(),
    };
  }

  loadActives = () => {
    const cls = ["bg-[#302F4A]", "rounded-lg"];
    // reset
    this.references.t1.current?.classList.remove(...cls);
    this.references.t2.current?.classList.remove(...cls);
    this.references.s1.current?.classList.remove(...cls);
    this.references.s2.current?.classList.remove(...cls);
    this.references.p1.current?.classList.remove(...cls);
    this.references.p2.current?.classList.remove(...cls);

    // set temperature
    if (this.state.temperature === "C") {
      store.dispatch(changeCelsius());
      this.references.t1.current?.classList.add(...cls);
    }

    if (this.state.temperature === "F") {
      store.dispatch(changeFahren());
      this.references.t2.current?.classList.add(...cls);
    }

    // set wind
    if (this.state.windSpeed === "km/h") {
      store.dispatch(changeKM());
      this.references.s1.current?.classList.add(...cls);
    }

    if (this.state.windSpeed === "mph") {
      store.dispatch(changeMPH());
      this.references.s2.current?.classList.add(...cls);
    }

    // set precipitation
    if (this.state.precipitation === "mm")
      this.references.p1.current?.classList.add(...cls);
    if (this.state.precipitation === "in")
      this.references.p2.current?.classList.add(...cls);
  };

  loadMenu = () => {
    if (this.state.menu)
      this.references.menu.current.classList.remove("hidden");
    else this.references.menu.current?.classList.add("hidden");
  };

  componentDidMount() {
    this.loadActives();
  }
  componentDidUpdate() {
    this.loadActives();
    this.loadMenu();
  }

  render() {
    return (
      <>
        <div className="relative">
          <div
            className="box flex items-center justify-center gap-1 bg-[#262540] w-23 h-10  rounded-lg cursor-pointer "
            onClick={() => this.setState({ menu: !this.state.menu })}
          >
            <img src={icon_units} alt="units" className="w-3.5" />
            <p className="text-sm text-white">Units</p>
            <img src={icon_dropdown} alt="dropdown" className="w-3.5" />
          </div>

          <div
            className="box bg-[#232540] w-fit rounded-lg py-2 mt-1 px-3 space-y-2 hidden absolute right-0"
            ref={this.references.menu}
          >
            <p className="rounded-lg px-1 py-1">Switch to imperial</p>

            <p className="opacity-50 ">Temperature</p>
            <ul className="border-b-2 border-[#302F4A]">
              <li
                id="t1"
                ref={this.references.t1}
                className="px-2 py-1 rounded-lg cursor-pointer"
                onClick={() => this.setState({ temperature: "C" })}
              >
                Celsius (°C)
              </li>
              <li
                id="t2"
                ref={this.references.t2}
                className="px-2 py-1 rounded-lg cursor-pointer"
                onClick={() => this.setState({ temperature: "F" })}
              >
                Fahrenheit (°F)
              </li>
            </ul>

            <p className="opacity-50">Wind speed</p>
            <ul className="border-b-2 border-[#302F4A]">
              <li
                id="s1"
                ref={this.references.s1}
                className="px-2 py-1 rounded-lg cursor-pointer"
                onClick={() => this.setState({ windSpeed: "km/h" })}
              >
                km/h
              </li>
              <li
                id="s2"
                ref={this.references.s2}
                className="px-2 py-1 rounded-lg cursor-pointer"
                onClick={() => this.setState({ windSpeed: "mph" })}
              >
                mph
              </li>
            </ul>

            <p className="opacity-50">Precipitation</p>
            <ul>
              <li
                id="p1"
                ref={this.references.p1} // ✅ bio je t1
                className="px-2 py-1 rounded-lg cursor-pointer"
                onClick={() => this.setState({ precipitation: "mm" })}
              >
                Millimeters (mm)
              </li>
              <li
                id="p2"
                ref={this.references.p2} // ✅ bio je t2
                className="px-2 py-1 rounded-lg cursor-pointer"
                onClick={() => this.setState({ precipitation: "in" })}
              >
                Inches (in)
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}
