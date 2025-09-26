import "./App.css";
// App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchWeather } from "./app/weatherSlice";
import SearchBar from "./components/SearchBar";
import WeatherInfo from "./components/WeatherInfo";
import WeatherInfoMore from "./components/WeatherInfoMore";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import SettingsDay from "./components/SettingsDay";
import Settings from "./components/Settings";
import icon_logo from "./assets/logo.svg";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { TextPlugin } from "gsap/TextPlugin";

import store from "./app/store";

// Registruj pluginove
gsap.registerPlugin(
  useGSAP,
  Observer,
  ScrollTrigger,
  ScrollSmoother,
  TextPlugin
);

export default function App() {
  const dispatch = useDispatch();
  useGSAP(() => {
    // Timeline za početno učitavanje
    const tl = gsap.timeline();

    // 1. Animacija header-a
    tl.fromTo(
      "header",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )

      // 2. Search bar
      .fromTo(
        "header + *", // SearchBar
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4" // preklapanje sa prethodnom animacijom
      )
      .fromTo(
        ".info > *",
        {
          opacity: 0,
          y: 50,
          rotationX: 15,
          transformOrigin: "center bottom",
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      )
      // 3. Glavni naslov
      .fromTo(
        "#h1",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.3"
      )

      // 4. Weather kartice jedna po jedna (staggered)
      .fromTo(
        ".weather-card",
        {
          opacity: 0,
          y: 60,
          rotationX: 45,
          transformOrigin: "bottom center",
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1, // 0.1s između svake kartice
        },
        "-=0.2"
      )

      // 5. Daily forecast kartice
      .fromTo(
        ".daily-card",
        {
          opacity: 0,
          x: -30,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.05, // brže jer ih ima više
        },
        "-=0.3"
      )

      // 6. Hourly forecast
      .fromTo(
        ".hourly-forecast",
        {
          opacity: 0,
          x: 50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

    // Scroll animacije za elemente koji se pojavljują
    gsap.utils.toArray(".scroll-animate").forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Hover animacije za kartice
    gsap.utils.toArray(".hover-card").forEach((card) => {
      const tl = gsap.timeline({ paused: true });

      tl.to(card, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      }).to(
        card.querySelector(".card-content"),
        {
          y: -2,
          duration: 0.3,
          ease: "power2.out",
        },
        0
      );

      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });
  });
  useEffect(() => {
    dispatch(fetchWeather("Belgrade")); // ← MORA da postoji
  }, [dispatch]);
  console.log("DAN: ", store.getState().dayName.value);
  return (
    <>
      <header className="flex justify-between py-7 sm:px-5 max-w-7xl mx-auto relative z-50 px-10">
        <div className="logo">
          <img src={icon_logo} alt="logo" />
        </div>
        <Settings></Settings>
      </header>

      <div className="px-10 pt-10">
        <SearchBar></SearchBar>
      </div>

      <h1 id="h1" className="mt-8 text-6xl text-center font-bold px-10 py-4">
        How's the sky looking today
      </h1>

      <div className="xl:flex xl:gap-10 max-w-7xl mx-auto px-10">
        <main className="xl:flex-2">
          <div className="info my-8 ">
            <WeatherInfo></WeatherInfo>
          </div>

          <WeatherInfoMore></WeatherInfoMore>
          <h2 className="text-3xl mt-18 font-bold">Daily forecast</h2>
          <div className="daily grid grid-cols-3 sm:grid-cols-7 gap-2 my-8">
            <DailyForecast index={0}></DailyForecast>
            <DailyForecast index={1}></DailyForecast>
            <DailyForecast index={2}></DailyForecast>
            <DailyForecast index={3}></DailyForecast>
            <DailyForecast index={4}></DailyForecast>
            <DailyForecast index={5}></DailyForecast>
            <DailyForecast index={6}></DailyForecast>
          </div>
          <div className="horuly px-3 bg-[#262540] py-3  rounded-3xl xl:hidden ">
            <header className="flex items-center  justify-between my-2 relative z-10">
              <h2 className="text-lg">Horuly forecast</h2>
              <SettingsDay></SettingsDay>
            </header>
            <div className="body">
              <HourlyForecast />
            </div>
          </div>
        </main>
        <div className="horuly px-3 bg-[#262540] py-3 rounded-3xl hidden xl:block my-8 flex-1">
          <header className="flex items-center  justify-between my-2 relative z-10">
            <h2 className="text-lg font-bold">Horuly forecast</h2>
            <SettingsDay></SettingsDay>
          </header>
          <div className="body relative">
            <HourlyForecast />
          </div>
        </div>
      </div>
    </>
  );
}
/* <WeatherInfo></WeatherInfo>
      <WeatherInfoMore></WeatherInfoMore>
      <DailyForecast index={0}></DailyForecast>
      <HourlyForecast dayIndex={0}></HourlyForecast>
      <hr />*/
