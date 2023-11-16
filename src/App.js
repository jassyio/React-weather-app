import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

function App() {
  const [location, setLocation] = useState('');
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
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

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Weather App', {
            body: 'You will now receive weather updates!',
          });
        }
      });
    }
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
    requestNotificationPermission(); // Request notification permission on load
  }, [fetchWeatherForDefaultLocation]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Show the advertisement after 5 seconds
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 5000);

    // Clear the timer when the component unmounts or if advertisement is closed
    return () => clearTimeout(timer);
  }, []);

  const closeAdvertisement = () => {
    setShowAd(false);
  };


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
          <div className="temp">
            <h1>{Math.round(data.main?.temp - 271)} °C</h1>
          </div>
          <div className="location">
            <p>{data.name}</p>
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
      <div class="modal-overlay">
      <div class="modal-content">
        <div>
        <button onClick={openModal}>Show Advertisement</button>
        </div>
      
     <Modal 
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Advertisement Modal"
      >
        <h2>Advertisements</h2>
        <p>Content of your advertisement goes here.</p>
        <button onClick={closeModal}>Close</button>
      </Modal> 
  </div>
</div>
</div>
);
}

export default App;
