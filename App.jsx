import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
} from "@mui/material";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchWeather = async (selectedCity) => {
    const query = (selectedCity ?? city).trim();
    if (!query) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          query
        )}&appid=13667b2448f66f443800645484c7c740&units=metric`
      );
      const data = await res.json();

      if (res.ok && Number(data.cod) === 200) {
        setWeather({
          name: data.name,
          temp: data.main?.temp,
          condition: data.weather?.[0]?.main,
        });

        setHistory((prev) =>
          prev.includes(data.name) ? prev : [data.name, ...prev].slice(0, 5)
        );
      } else {
        alert(data?.message || "City not found");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Try again.");
    }
  };

  return (
    <Container
      maxWidth={false} 
      sx={{
        height: "100vh", 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", 
        bgcolor: "lightblue", 
      }}
    >
      <Card sx={{ p: 12, borderRadius: 3, boxShadow: 4, bgcolor: "white" }}>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          color="darkblue"
          sx={{ fontWeight: "bold" }}
        >
          Weather App 🌦️
        </Typography>

      
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <TextField
              label="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => fetchWeather()}>
              Search
            </Button>
          </Grid>
        </Grid>

        
        {history.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mt: 3, flexWrap: "wrap", gap: 1 }}
          >
            {history.map((c) => (
              <Chip
                key={c}
                label={c}
                onClick={() => fetchWeather(c)}
                variant="outlined"
                clickable
              />
            ))}
          </Stack>
        )}

      
        {weather && (
          <Card sx={{ mt: 8, textAlign: "center", bgcolor: "#f0f8ff" }}>
            <CardContent>
              <Typography variant="h5">{weather.name}</Typography>
              <Typography variant="h6">🌡️ {weather.temp} °C</Typography>
              <Typography variant="body1">☁️ {weather.condition}</Typography>
            </CardContent>
          </Card>
        )}
      </Card>
    </Container>
  );
}

export default App;
