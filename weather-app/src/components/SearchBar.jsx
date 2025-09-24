import { Component } from "react";
import icon_search from "../assets/icon-search.svg";
export default class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="flex flex-col gap-1">
          <div className="searchbar flex bg-[#262540] items-center rounded-lg px-3 py-3">
            <div className="img">
              <img src={icon_search} alt="ico" />
            </div>
            <div className="bar ">
              <input
                type="text"
                name="search"
                id="search"
                className="p-0 m-0 border-none outline-none indent-2.5"
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
