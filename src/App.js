import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Axios from 'axios';
import Modal from 'react-modal';
import Input from "./input";

Modal.setAppElement('#root'); // Set the root element for accessibility

function App() {
  const [location, setLocation] = useState('');
  const [data, setData] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const defaultLocation = 'Nairobi';
  const apiKey = 'e433fde7be9e5bd4105836a6101b6f90';

  const fetchWeatherForDefaultLocation = useCallback(() => {
    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${apiKey}`;
    fetchWeather(locationUrl);
    fetchWeeklyWeather(defaultLocation);
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

  const fetchWeeklyWeather = (location) => {
    const weeklyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;
    Axios.get(weeklyUrl)
      .then((response) => {
        const dailyData = {};
        response.data.list.forEach((forecast) => {
          const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyData[date]) {
            dailyData[date] = forecast;
          }
        });
        const sortedDailyData = Object.values(dailyData).slice(0, 7); // Ensure only 7 days are selected
        setWeeklyData(sortedDailyData);
        setSelectedDay(sortedDailyData[0]); // Set the first day's data as default
        console.log(dailyData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      fetchWeather(locationUrl);
      fetchWeeklyWeather(location);
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
            fetchWeeklyWeather(`${latitude},${longitude}`);
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

  const openNotificationSettings = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    } else if (Notification.permission === 'denied') {
      alert('Notifications are blocked. Please enable them in your browser settings.');
    } else {
      alert('Notifications are already allowed.');
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="App">
      <div className='dashboard'>
        <img src="./pocket-weather-app-high-resolution-logo-white-transparent (2).png" alt="App Logo" className="app-logo" />
        <div className="settings">
          <img src="./settings.png" alt="Settings" onClick={openNotificationSettings} />
        </div>
      </div>
      <div className="search">
        <div className="search-bar">
          <img src="./search.png" alt="Search Icon" className="search-icon" />
          <Input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={searchLocation}
          />
        </div>
      </div>
      <div className="container">
        <div className="top">
          <div className="temp">
            <h1>{Math.round((selectedDay ? selectedDay.main.temp : data.main?.temp) - 273.15)} °C</h1>
          </div>
          <div className="location">
            <p>{selectedDay ? selectedDay.name : data.name}</p>
          </div>
          <div className="description">
            <p>{selectedDay ? selectedDay.weather[0].description : data.weather?.[0]?.description}</p>
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            <p>Feels Like</p>
            <p className="bold">{Math.round((selectedDay ? selectedDay.main.feels_like : data.main?.feels_like) - 273.15)} °C</p>
          </div>
          <div className="humid">
            <p>Humidity</p>
            <p className="bold">{selectedDay ? selectedDay.main.humidity : data.main?.humidity} %</p>
          </div>
          <div className="wind">
            <p>Wind Speed</p>
            <p className="bold">{Math.round((selectedDay ? selectedDay.wind.speed : data.wind?.speed) * 3.6)} Km/h</p>
          </div>
        </div>
      </div>
      <div className="weekly-forecast">
        {weeklyData.length > 0 ? weeklyData.map((day, index) => (
          <div
            key={index}
            className={`day ${selectedDay === day ? 'selected' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
        )) : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default App;
