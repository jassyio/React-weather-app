import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [location, setLocation] = useState('Nairobi');
  const [data, setData] = useState({});
  const apiKey = 'e433fde7be9e5bd4105836a6101b6f90';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      Axios.get(url)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setLocation('');
    }
  };

  useEffect(() => {
    Axios.get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [url]); // Empty dependency array to fetch data only once on component mount

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
