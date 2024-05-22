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
  const [locationName, setLocationName] = useState('');
  const [isListening, setIsListening] = useState(false); // State to track voice listening
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const defaultLocation = 'Nairobi';
  const apiKey = 'e433fde7be9e5bd4105836a6101b6f90';

  // Function to handle voice search
  const handleVoiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition(); // For Chrome
  
    recognition.lang = 'en-US';
  
    recognition.onstart = function() {
      setIsListening(true);
    };
  
    recognition.onresult = function(event) {
      const spokenText = event.results[0][0].transcript;
      setLocation(spokenText);
      // Fetch weather data after setting the location
      const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${spokenText}&appid=${apiKey}`;
      fetchWeather(locationUrl);
      fetchWeeklyWeather(spokenText);
    };
  
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      alert('Speech recognition error. Please try again.');
    };
  
    recognition.onend = function() {
      setIsListening(false);
    };
  
    recognition.start();
  };

  // Function to fetch weather for the default location
  const fetchWeatherForDefaultLocation = useCallback(() => {
    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${apiKey}`;
    fetchWeather(locationUrl);
    fetchWeeklyWeather(defaultLocation);
  }, [defaultLocation, apiKey]);

  // Function to fetch weather data from API
  const fetchWeather = (url) => {
    setIsLoading(true);
    Axios.get(url)
      .then((response) => {
        setData(response.data);
        setLocationName(response.data.name);
        setIsLoading(false);
        setLocation(''); // Clear the location input after fetching weather data
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setIsLoading(false);
      });
  };
  

  // Function to fetch weekly weather data from API
  const fetchWeeklyWeather = (location) => {
    setIsLoading(true);
    const weeklyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;
    Axios.get(weeklyUrl)
      .then((response) => {
        if (response.data && response.data.list) {
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
          setLocationName(response.data.city.name); // Set the location name
          setIsLoading(false);
          console.log('Daily data:', dailyData);
        } else {
          console.error('Unexpected response structure:', response.data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching weekly weather data:', error);
        setIsLoading(false);
      });
  };

  // Function to handle location search
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      fetchWeather(locationUrl);
      fetchWeeklyWeather(location);
      setLocation(''); // Reset the location input after fetching weather data
    }
  };

  // Function to handle fetching current location weather
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
            console.error('Geolocation error:', error);
            fetchWeatherForDefaultLocation();
          }
        );
      } else {
        fetchWeatherForDefaultLocation();
      }
    };

    getCurrentLocationWeather();
  }, [fetchWeatherForDefaultLocation]);

  // Function to handle notification settings
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

  // Function to handle day click for weekly forecast
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  // Function to render weather icon based on weather condition
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

  // Function to handle automatic search with device location name
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({name: 'geolocation'}).then((permission) => {
        if (permission.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              Axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
                .then((response) => {
                  setLocation(response.data.name); // Set the location to city name
                  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${response.data.name}&appid=${apiKey}`);
                  fetchWeeklyWeather(response.data.name);
                })
                .catch((error) => {
                  console.error('Error fetching weather data:', error);
                });
            },
            (error) => {
              console.error('Geolocation error:', error);
            }
          );
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <div className='dashboard'>
        <img src="./pocket-weather-app-high-resolution-logo-white-transparent (2).png" alt="App Logo" className="app-logo" />
        <div className="settings">
          <img
            src="./settings.png" alt="Settings" onClick={openNotificationSettings} />
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
          <div className="voice-search-btn" onClick={handleVoiceSearch}>
            <img src="./microphone.png" alt="Microphone Icon" className="microphone-icon" />
            {isListening && <div className="red-dot"></div>}
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
            <p>Wind</p>
            <p className="bold">{Math.round((selectedDay ? selectedDay.wind.speed : data.wind?.speed) * 3.6)} Km/h</p>
          </div>
        </div>
      </div>
      <div className="weekly-forecast">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          weeklyData.length > 0 && weeklyData.map((day, index) => (
            <div
              key={index}
              className={`day ${selectedDay === day ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
