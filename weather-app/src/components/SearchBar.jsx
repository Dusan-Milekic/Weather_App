// src/components/SearchBar.jsx
import { Component } from "react";
import { connect } from "react-redux";
import icon_search from "../assets/icon-search.svg";
import { fetchWeather } from "../app/weatherSlice";

class SearchBar extends Component {
  state = { q: "" };

  onChange = (e) => this.setState({ q: e.target.value });
  submit = () => {
    const city = this.state.q.trim();
    if (!city) return; // ignorisi prazno
    this.props.fetchWeather(city); // ✅ pošalji grad u thunk
  };
  onKeyDown = (e) => {
    if (e.key === "Enter") this.submit();
  };

  render() {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 sm:max-w-3xl sm:mx-auto">
        <div className="searchbar flex bg-[#262540] items-center rounded-lg px-3 py-3 flex-2">
          <div className="img">
            <img src={icon_search} alt="ico" />
          </div>
          <div className="bar w-full">
            <input
              type="text"
              id="search"
              className="p-0 m-0 border-none outline-none indent-5 w-full"
              placeholder="example: Belgrade"
              value={this.state.q}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={this.submit}
          className="btn px-7 pb-3 py-2 bg-[#4658D9] rounded-lg cursor-pointer"
        >
          <p className="text-xl text-center">Search</p>
        </button>
      </div>
    );
  }
}

export default connect(null, { fetchWeather })(SearchBar);
