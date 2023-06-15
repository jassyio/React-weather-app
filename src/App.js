import React, { useState } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
 const [location, setLocation] = useState('')
 const [data, setData] = useState({})
 const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=e433fde7be9e5bd4105836a6101b6f90`;

const searchLocation = (event) => {
  if (event.key === 'Enter') {
    Axios.get(url).then((response)=> {
      setData(response.data)
      console.log(response.data);
    })
    setLocation('')
  }
}
  return (
<div className="App">
  <div className='search'>
    <input 
    value={location}
    onChange={Event=> setLocation(Event.target.value)}
    onKeyPress={searchLocation}
    placeholder='Enter location'
    type='text'
    />
  </div>
<div className="container">
<div className="top">
 <div className='location'> 
<p>{data.name}</p></div>
<div className='temp'>
  <h1> {data.main?.temp}</h1>
  </div>
<div className='description'>
  <p>{data.weather?.[0]?.description}</p>
  </div>
</div>
<div className="bottom">
  <div className='feels'> 
  <p>Feels like</p>
    <p className='bold'>{data.main?.temp} </p>
  </div>
  <div className='humid'>
  <p>Humidity </p>
    <p className='bold'>{data.main?.humidity} </p>
  </div>
  <div className='wind'>
  <p>Wind speed</p>
      <p className='bold'> {data.wind?.speed}</p>
  </div>
</div>   
</div>
    </div>
  );
}

export default App;