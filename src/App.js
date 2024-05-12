import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

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
        // You can call your notification function here if needed
      })
      .catch((error) => {
        console.log(error);
        // Display error message to the user
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
  const openNotificationSettings = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    } else if (Notification.permission === 'denied') {
      // Notify the user that notifications are blocked
      alert('Notifications are blocked. Please enable them in your browser settings.');
    } else {
      // Notify the user that notifications are already allowed
      alert('Notifications are already allowed.');
    }
  }; 
  // const toggleNotificationPermission = () => {
  //   if (Notification.permission === 'granted') {
  //     Notification.permission = 'denied';
  //     setNotificationPermission('denied');
  //   } else {
  //     Notification.requestPermission().then(permission => {
  //       setNotificationPermission(permission);
  //     });
  //   }
  // };
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
  <input
    value={location}
    onChange={(event) => setLocation(event.target.value)}
    onKeyPress={searchLocation}
    placeholder="Enter location"
    type="text"
  />
</div>
  </div>


      <div className="container">
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
            <p>temperature</p>
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
      {/* <div className="modal-overlay">
        <div className="modal-content">
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
      </div> */}

    
      </div>
    </div>
  );
}

export default App;
