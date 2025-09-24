import { Component } from "react";
import icon_search from "../assets/icon-search.svg";
import GetWeatherLocation from "../api/apiWeather"; // ✅

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    GetWeatherLocation("Belgrade").then((t) => {
      console.log(t);
    });
  }

  render() {
    return (
      <>
        <div className="flex flex-col gap-1">
          <div className="searchbar flex bg-[#262540] items-center rounded-lg px-3 py-3">
            <div className="img">
              <img src={icon_search} alt="ico" />
            </div>
            <div className="bar w-full">
              <input
                type="text"
                name="search"
                id="search"
                className="p-0 m-0 border-none outline-none indent-5 w-full"
                c
              />
            </div>
          </div>

          <div className="btn px-7 pb-3 py-2 bg-[#4658D9]">
            <p className="text-xl text-center">Search</p>
          </div>
        </div>
      </>
    );
  }
}
