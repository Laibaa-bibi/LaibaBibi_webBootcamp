import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weatherData1, setWeatherData1] = useState(null);
  const [weatherData2, setWeatherData2] = useState(null);
  const [hourlyForecast1, setHourlyForecast1] = useState(null);
  const [hourlyForecast2, setHourlyForecast2] = useState(null);
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [backgroundClass1, setBackgroundClass1] = useState('');
  const [backgroundClass2, setBackgroundClass2] = useState('');

  const fetchWeatherData = async (city, setData, setBackgroundClass) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f7e6e0225a3f2d891c4871c3585fdacb&units=metric`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
        setBackgroundClass(getBackgroundClass(data.weather[0].main));
      } else {
        throw new Error('Failed to fetch weather data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHourlyForecast = async (city, setForecast) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f7e6e0225a3f2d891c4871c3585fdacb&units=metric`);
      if (response.ok) {
        const data = await response.json();
        setForecast(data.list);
      } else {
        throw new Error('Failed to fetch hourly forecast data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBackgroundClass = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return 'clear';
      case 'Clouds':
        return 'cloudy';
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        return 'rainy';
      case 'Snow':
        return 'snowy';
      default:
        return '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (compareMode) {
      if (city1.trim() !== '' && city2.trim() !== '') {
        fetchWeatherData(city1, setWeatherData1, setBackgroundClass1);
        fetchWeatherData(city2, setWeatherData2, setBackgroundClass2);
        fetchHourlyForecast(city1, setHourlyForecast1);
        fetchHourlyForecast(city2, setHourlyForecast2);
      }
    } else {
      if (city1.trim() !== '') {
        fetchWeatherData(city1, setWeatherData1, setBackgroundClass1);
        fetchHourlyForecast(city1, setHourlyForecast1);
      }
    }
  };

  const handleChange = (event, setCity) => {
    setCity(event.target.value);
  };

  const handleToggle = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      setWeatherData2(null);
      setHourlyForecast2(null);
      setBackgroundClass2('');
      setCity2('');
    }
  };

  return (
    <div className={`container ${compareMode ? 'comparison' : backgroundClass1}`}>
      <h1 className="title">WeatherNow</h1>
      <div className="toggle">
        <label htmlFor="compareToggle">Compare</label>
        <input
          id="compareToggle"
          type="checkbox"
          checked={compareMode}
          onChange={handleToggle}
        />
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Enter city name 1"
          value={city1}
          onChange={(event) => handleChange(event, setCity1)}
        />
        {compareMode && (
          <input
            type="text"
            className="input"
            placeholder="Enter city name 2"
            value={city2}
            onChange={(event) => handleChange(event, setCity2)}
          />
        )}
        <button type="submit" className="button">{compareMode ? "Compare Weather" : "Get Weather"}</button>
      </form>
      {weatherData1 && (
        <div className={`weather-info ${backgroundClass1}`}>
          <h2>{weatherData1.name}, {weatherData1.sys.country}</h2>
          <p>Temperature: {weatherData1.main.temp}°C</p>
          <p>Weather: {weatherData1.weather[0].description}</p>
          <p>Humidity: {weatherData1.main.humidity}%</p>
          <p>Wind Speed: {weatherData1.wind.speed} m/s</p>
        </div>
      )}
      {weatherData2 && (
        <div className={`weather-info ${backgroundClass2}`}>
          <h2>{weatherData2.name}, {weatherData2.sys.country}</h2>
          <p>Temperature: {weatherData2.main.temp}°C</p>
          <p>Weather: {weatherData2.weather[0].description}</p>
          <p>Humidity: {weatherData2.main.humidity}%</p>
          <p>Wind Speed: {weatherData2.wind.speed} m/s</p>
        </div>
      )}
      {hourlyForecast1 && (
        <div className="hourly-forecast">
          <h2>Hourly Forecast for {weatherData1.name}</h2>
          <ul>
            {hourlyForecast1.map((hour) => (
              <li key={hour.dt}>{new Date(hour.dt * 1000).toLocaleTimeString()}: {hour.main.temp}°C, {hour.weather[0].description}</li>
            ))}
          </ul>
        </div>
      )}
      {hourlyForecast2 && (
        <div className="hourly-forecast">
          <h2>Hourly Forecast for {weatherData2.name}</h2>
          <ul>
            {hourlyForecast2.map((hour) => (
              <li key={hour.dt}>{new Date(hour.dt * 1000).toLocaleTimeString()}: {hour.main.temp}°C, {hour.weather[0].description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
