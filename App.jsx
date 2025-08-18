import React, { useState, useEffect } from "react";
import axios from "axios";
import "weather-icons/css/weather-icons.css";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [recentCities, setRecentCities] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentCities");
    if (stored) setRecentCities(JSON.parse(stored));
  }, []);

  const fetchWeather = async (cityName) => {
    const queryCity = cityName || city;
    if (!queryCity) return alert("Please enter a city name.");
    try {
      const res = await axios.get(
        `http://localhost:5001/api/forecast?city=${queryCity}`
      );
      setWeather(res.data);

      const updated = [queryCity, ...recentCities.filter(c => c !== queryCity)];
      const limited = updated.slice(0, 5);
      setRecentCities(limited);
      localStorage.setItem("recentCities", JSON.stringify(limited));
      if (!cityName) setCity("");
    } catch (err) {
      console.error(err);
      alert("Could not fetch weather data.");
    }
  };

  const getSuggestions = (temp, desc, humidity) => {
    let message = "☁️ Weather is normal.";
    if (desc.includes("rain")) message = "☔ Carry an umbrella.";
    else if (temp > 30) message = "🔥 Too hot! Wear light clothes.";
    else if (temp < 15) message = "🧣 Cold day! Dress warm.";
    if (humidity > 80) message += " 🫧 High humidity—stay cool!";
    return message;
  };

  const getBackgroundClass = (desc) => {
    if (!desc) return "default";
    if (desc.includes("clear")) return "clear";
    if (desc.includes("cloud")) return "clouds";
    if (desc.includes("rain")) return "rain";
    if (desc.includes("snow")) return "snow";
    return "default";
  };

  const getIconClass = (iconCode) => {
    const mapping = {
      "01d": "wi-day-sunny",
      "01n": "wi-night-clear",
      "02d": "wi-day-cloudy",
      "02n": "wi-night-alt-cloudy",
      "03d": "wi-cloud",
      "03n": "wi-cloud",
      "04d": "wi-cloudy",
      "04n": "wi-cloudy",
      "09d": "wi-showers",
      "09n": "wi-showers",
      "10d": "wi-day-rain",
      "10n": "wi-night-alt-rain",
      "11d": "wi-thunderstorm",
      "11n": "wi-thunderstorm",
      "13d": "wi-snow",
      "13n": "wi-snow",
      "50d": "wi-fog",
      "50n": "wi-fog",
    };
    return mapping[iconCode] || "wi-na";
  };

  return (
    <div
      className={`container ${
        weather ? getBackgroundClass(weather.weather[0].description) : "default"
      }`}
    >
      <h1>🌦 Smart Weather App</h1>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city..."
      />
      <button onClick={() => fetchWeather()}>Get Forecast</button>

      {recentCities.length > 0 && (
        <div className="recent">
          <h3>Recent Cities:</h3>
          {recentCities.map((c, idx) => (
            <button key={idx} onClick={() => fetchWeather(c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      {weather && (
        <div className="result">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>{new Date(weather.dt * 1000).toLocaleString()}</p>
          <div className="icon-row">
            <i
              className={`wi ${getIconClass(weather.weather[0].icon)} ${
                getIconClass(weather.weather[0].icon) === "wi-day-sunny"
                  ? "spin"
                  : ""
              }`}
              style={{ fontSize: "48px" }}
            ></i>
            <p>{weather.weather[0].description}</p>
          </div>
          <p>🌡️ Temperature: {weather.main.temp} °C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>📝 {getSuggestions(weather.main.temp, weather.weather[0].description, weather.main.humidity)}</p>
        </div>
      )}
    </div>
  );
}
