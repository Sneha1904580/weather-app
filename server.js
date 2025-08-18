const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 5001;

app.use(cors());

const WEATHER_API_KEY = "13667b2448f66f443800645484c7c740"; // Replace this!

app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "Missing city parameter" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({ error: data.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(` Backend running on http://localhost:${PORT}`);
});
