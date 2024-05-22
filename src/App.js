import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Axios from 'axios';
import Modal from 'react-modal';
import Input from "./input";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

Modal.setAppElement('#root');

function App() {
  const [location, setLocation] = useState('');
  const [data, setData] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [locationName, setLocationName] = useState('');
  const defaultLocation = 'Nairobi';
  const apiKey = 'e433fde7be9e5bd4105836a6101b6f90';

  recognition.onstart = () => {
    console.log('Voice recognition started');
  };

  recognition.onspeechend = () => {
    recognition.stop();
    console.log('Voice recognition stopped');
  };

  recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    console.log('Transcript:', transcript);
    setLocation(transcript);
    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${transcript}&appid=${apiKey}`);
    fetchWeeklyWeather(transcript);
  };

  const [isRecording, setIsRecording] = useState(false);
  const startVoiceRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
  
    recognition.onstart = () => {
      setIsRecording(true);
    };
  
    recognition.onend = () => {
      setIsRecording(false);
    };
  
    recognition.onresult = (event) => {
      const location = event.results[0][0].transcript;
      setLocation(location);
      searchLocation({ key: 'Enter' });
    };
  
    recognition.start();
  };

  const fetchWeatherForDefaultLocation = useCallback(() => {
    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${apiKey}`;
    fetchWeather(locationUrl);
    fetchWeeklyWeather(defaultLocation);
  }, [defaultLocation, apiKey]);

  const fetchWeather = (url) => {
    Axios.get(url)
      .then((response) => {
        setData(response.data);
        setLocationName(response.data.name);
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
        const sortedDailyData = Object.values(dailyData).slice(0, 7);
        setWeeklyData(sortedDailyData);
        setSelectedDay(sortedDailyData[0]);
        setLocationName(response.data.city.name);
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

  const renderWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear':
        return <i className="wi wi-day-sunny"></i>;
      case 'Clouds':
        return <i className="wi wi-day-cloudy"></i>;
      case 'Rain':
        return <i className="wi wi-rain"></i>;
      case 'Drizzle':
        return <i className="wi wi-day-showers"></i>;
      default:
        return <i className="wi wi-day-sunny"></i>;
    }
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
  <div className="voice-search" onClick={startVoiceRecognition}>
    <img src="./microphone.png" alt="Microphone Icon" className="microphone-icon" />
    {isRecording && <div className="recording-indicator">Recording...</div>}
  </div>
</div>

      </div>
      <div className="container">
        <div className="top">
          <div className="location-name">
            <h2>{locationName}</h2>
          </div>
          <div className="temp">
            <h1>{Math.round((selectedDay ? selectedDay.main.temp : data.main?.temp) - 273.15)} °C</h1>
          </div>
          <div className="description-container">
            <p className="description">
              {selectedDay ? selectedDay.weather[0].description : data.weather?.[0]?.description}
            </p>
            <div className="weather-icon">
              {selectedDay ? renderWeatherIcon(selectedDay.weather[0].main) : renderWeatherIcon(data.weather?.[0]?.main)}
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            <p>temperature</p>
            <p className="bold">{Math.round((selectedDay ? selectedDay.main.feels_like : data.main?.feels_like) - 273.15)} °C</p>
          </div>
          <div className="humid">
            <p>Humidity</p>
            <p className="bold">{selectedDay ? selectedDay.main.humidity : data.main?.humidity} %</p>
          </div>
          <div className="wind">
            <p>Wind </p>
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
