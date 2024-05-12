const showWeatherNotification = (weatherData) => {
    if (Notification.permission === 'granted') {
      const { name, weather, main } = weatherData;
      const notification = new Notification(`${name} Weather Update`, {
        body: `${weather[0].description}. Current temperature: ${Math.round(main.temp - 271)}°C`,
      });
      
      // Close the notification after 10 seconds
      setTimeout(notification.close.bind(notification), 10000);
    }
  };
  
  export { showWeatherNotification };
  