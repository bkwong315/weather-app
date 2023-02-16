import { useEffect, useState } from 'react';

import WeatherData from './interfaces/WeatherData';
import CurrentWeatherResponse from './interfaces/CurrentWeatherData';
import ForecastResponse from './interfaces/ForecastResponse';
import ForecastListData from './interfaces/ForecastListData';
import SelectedDateTemplate from './interfaces/SelectedDateDisplay';

import SelectedDateDisplay from './components/SelectedDateDisplay/SelectedDateDisplay';
import ForecastList from './components/ForecastList/ForecastList';
import './App.scss';

function App() {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [units, setUnits] = useState({ system: 'imperial', tempUnit: 'F', windUnit: 'mph' });
  const [selectedDate, setSelectedDate] = useState<SelectedDateTemplate>();
  const [forecastData, setForecastData] = useState<Array<ForecastListData>>();
  const [lastQuery, setLastQuery] = useState('');

  const API_KEY = 'a8d2cbc847ed40ce311d65394e47f905';

  useEffect(() => {
    const searchForm = document.querySelector('.search-container');
    const cityInput = document.querySelector('#city') as HTMLInputElement;
    const searchIcon = document.querySelector('#city ~ img');
    const errorDisplay = document.querySelector('.error');
    const imperialBtn = document.querySelector('.unit-control > span:first-child');
    const metricBtn = document.querySelector('.unit-control > span:last-child');

    searchForm?.addEventListener('submit', formSubmit);
    searchIcon?.addEventListener('click', submitQuery);

    function formSubmit(event: Event) {
      event.preventDefault();
      submitQuery();
    }

    async function submitQuery() {
      const query = cityInput.value;
      sendQuery(query);
    }

    imperialBtn?.addEventListener('click', switchUnits);
    metricBtn?.addEventListener('click', switchUnits);

    if (firstLoad) {
      sendQuery('los angeles');
    } else {
      sendQuery(lastQuery);
    }

    async function sendQuery(query: string) {
      errorDisplay?.classList.remove('visible');

      const geocodeData = await fetchData(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`,
      ).catch((error) => {
        console.error(error);
      });

      if (geocodeData.length === 0) {
        if (errorDisplay) {
          errorDisplay.classList.add('visible');
          errorDisplay.textContent = 'Invalid input. Please enter a valid city or country.';
          return;
        }
      }

      const currentWeatherData = await fetchData(
        `https://api.openweathermap.org/data/2.5/weather?lat=${geocodeData[0].lat}&lon=${geocodeData[0].lon}&units=${units.system}&appid=${API_KEY}`,
      ).catch((error) => {
        console.error(error);
      });

      const weatherData = await fetchData(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${geocodeData[0].lat}&lon=${geocodeData[0].lon}&units=${units.system}&appid=${API_KEY}`,
      ).catch((error) => {
        console.error(error);
      });

      setLastQuery(query);
      updateData(currentWeatherData, weatherData);
    }

    function switchUnits(event: Event) {
      const imperialBtn = document.querySelector('.unit-control > span:first-child');
      const metricBtn = document.querySelector('.unit-control > span:last-child');
      const selectedSystem = event.target instanceof HTMLElement ? event.target.dataset.system : 'imperial';

      if (selectedSystem === units.system) return;

      if (selectedSystem === 'imperial') {
        imperialBtn?.classList.add('selected');
        metricBtn?.classList.remove('selected');
        setUnits({ system: 'imperial', tempUnit: 'F', windUnit: 'mph' });
      } else {
        metricBtn?.classList.add('selected');
        imperialBtn?.classList.remove('selected');
        setUnits({ system: 'metric', tempUnit: 'C', windUnit: 'm/s' });
      }
    }

    return function cleanup() {
      searchForm?.removeEventListener('submit', formSubmit);
      searchIcon?.removeEventListener('click', submitQuery);
      imperialBtn?.removeEventListener('click', switchUnits);
      metricBtn?.removeEventListener('click', switchUnits);
    };
  }, [lastQuery, units]);

  function updateData(currentWeatherData: CurrentWeatherResponse, weatherData: ForecastResponse) {
    const fiveDayForecast = getFiveDayForecast(weatherData);

    formatForecastData(fiveDayForecast, currentWeatherData.timezone);
    formatCurrentWeatherData(currentWeatherData);
    setFirstLoad(false);
  }

  async function fetchData(apiURL: string) {
    const response = await fetch(apiURL);

    return await response?.json();
  }

  function getFiveDayForecast(weatherData: ForecastResponse): { [key: string]: WeatherData[] } {
    const aggregateTimestamps = weatherData.list.reduce(
      (weatherTimestamps: { [key: string]: WeatherData[] }, currentTimestamp: WeatherData) => {
        const timestampDay = getTimezoneAdjustedDate(currentTimestamp.dt, weatherData.city.timezone).getUTCDate();

        if (Object.keys(weatherTimestamps).length < 1) weatherTimestamps[timestampDay] = [currentTimestamp];

        let dayPresent = false;
        for (const weekDay in weatherTimestamps) {
          if (timestampDay.toString() === weekDay) {
            weatherTimestamps[weekDay].push(currentTimestamp);
            dayPresent = true;
            break;
          }
        }

        if (!dayPresent) weatherTimestamps[timestampDay] = [currentTimestamp];

        return weatherTimestamps;
      },
      {},
    );

    return aggregateTimestamps;
  }

  function formatForecastData(aggregateTimestamps: { [key: string]: WeatherData[] }, timezone: string) {
    const extremaValues = getExtremaValues(aggregateTimestamps);
    const forecastList: Array<ForecastListData> = [];

    for (const day in aggregateTimestamps) {
      for (const timestamp of aggregateTimestamps[day]) {
        const timezoneAdjustedHours = getTimezoneAdjustedDate(timestamp.dt, timezone).getUTCHours();

        if (timezoneAdjustedHours === 11 || timezoneAdjustedHours === 12 || timezoneAdjustedHours === 13) {
          forecastList.push({
            dt: String((parseInt(timestamp.dt, 10) + parseInt(timezone, 10)) * 1000),
            iconURL: `./imgs/weather-icons/${timestamp.weather[0].icon}.svg`,
            description: timestamp.weather[0].description,
            tempMin: extremaValues[day].min,
            tempMax: extremaValues[day].max,
            tempUnit: units.tempUnit,
          });
          break;
        }
      }
    }

    setForecastData(forecastList);
  }

  function formatCurrentWeatherData(currentWeatherData: CurrentWeatherResponse) {
    setSelectedDate({
      dt: String((parseInt(currentWeatherData.dt, 10) + parseInt(currentWeatherData.timezone, 10)) * 1000),
      iconURL: `./imgs/weather-icons/${currentWeatherData.weather[0].icon}.svg`,
      description: currentWeatherData.weather[0].description,
      city: currentWeatherData.name,
      country: currentWeatherData.sys.country,
      temp: String(Math.floor(parseFloat(currentWeatherData.main.temp))),
      feelsLike: String(Math.floor(parseFloat(currentWeatherData.main.feels_like))),
      tempMin: String(Math.floor(parseFloat(currentWeatherData.main.temp_min))),
      tempMax: String(Math.floor(parseFloat(currentWeatherData.main.temp_max))),
      tempUnit: units.tempUnit,
      rainfall: currentWeatherData.rain === undefined ? '0 mm/h' : currentWeatherData.rain['1h'],
      humidity: currentWeatherData.main.humidity,
      wind: String(Math.floor(parseFloat(currentWeatherData.wind.speed) * 10) / 10),
      windUnit: units.windUnit,
      windDeg: currentWeatherData.wind.deg,
    });
  }

  function getExtremaValues(aggregateTimestamps: { [key: string]: WeatherData[] }) {
    const extremaValues: { [key: string]: { min: string; max: string } } = {};
    for (const day in aggregateTimestamps) {
      let min = Infinity;
      let max: number = Number.NEGATIVE_INFINITY;

      for (const timestamp of aggregateTimestamps[day]) {
        const timestampMin = parseInt(timestamp.main.temp_min, 10);
        const timestampMax = parseInt(timestamp.main.temp_max, 10);

        min = timestampMin < min ? timestampMin : min;
        max = timestampMax > max ? timestampMax : max;
      }

      extremaValues[day] = { min: String(min), max: String(max) };
    }

    return extremaValues;
  }

  function getTimezoneAdjustedDate(timeInSec: string, timezone: string) {
    return new Date((parseInt(timeInSec, 10) + parseInt(timezone, 10)) * 1000);
  }

  return (
    <div className="App">
      <div className="search-container">
        <div className="unit-control">
          <span className="selected" data-system="imperial">
            °F
          </span>{' '}
          | <span data-system="metric">°C</span>
        </div>
        <form className="search-bar">
          <input type="text" name="city" id="city" placeholder="Enter City or Country" autoComplete="off" />
          <img src="./imgs/search.svg" alt="search" className="submit-btn" />
          <button type="submit"></button>
          <span className="error">Error!</span>
        </form>
      </div>
      {!firstLoad && <SelectedDateDisplay info={selectedDate as SelectedDateTemplate} />}
      {!firstLoad && <ForecastList forecastData={forecastData as Array<ForecastListData>} />}
    </div>
  );
}

export default App;
