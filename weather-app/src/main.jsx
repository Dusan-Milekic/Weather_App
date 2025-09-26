import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import store from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { gsap } from "gsap";

import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// create the scrollSmoother before your scrollTriggers
ScrollSmoother.create({
  smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
  effects: true, // looks for data-speed and data-lag attributes on elements
  smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <App />
        </div>
      </div>
    </Provider>
  </StrictMode>
);
