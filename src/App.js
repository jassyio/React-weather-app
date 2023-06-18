import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [location, setLocation] = useState('');
  const [data, setData] = useState({});
  const defaultLocation = 'Nairobi';
  const apiKey = 'e433fde7be9e5bd4105836a6101b6f90';

  const fetchWeatherForDefaultLocation = useCallback(() => {
    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${apiKey}`;
    fetchWeather(locationUrl);
  }, [defaultLocation, apiKey]);

  const fetchWeather = (url) => {
    Axios.get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      fetchWeather(locationUrl);
      setLocation('');
    }
  };

  useEffect(() => {
    const getCurrentLocationWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            fetchWeather(locationUrl);
          },
          (error) => {
            console.log(error);
            fetchWeatherForDefaultLocation();
          }
        );
      } else {
        fetchWeatherForDefaultLocation();
      }
    };

    getCurrentLocationWeather();
  }, [fetchWeatherForDefaultLocation]);
  return (
    <div className="App">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            <h1>{Math.round(data.main?.temp - 271)} °C</h1>
          </div>
          <div className="description">
            <p>{data.weather?.[0]?.description}</p>
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            <p>Feels like</p>
            <p className="bold">{Math.round(data.main?.feels_like - 271)} °C</p>
          </div>
          <div className="humid">
            <p>Humidity</p>
            <p className="bold">{data.main?.humidity} %</p>
          </div>
          <div className="wind">
            <p>Wind speed</p>
            <p className="bold">{Math.round(data.wind?.speed * 3.6)} Km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
