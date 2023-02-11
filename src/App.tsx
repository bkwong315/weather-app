import { useEffect, useState } from 'react';

import SelectedDateTemplate from './interfaces/SelectedDateDisplay';
import SelectedDateDisplay from './components/SelectedDateDisplay/SelectedDateDisplay';
import './App.scss';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<SelectedDateTemplate>();

  const units = 'imperial';
  const API_KEY = 'a8d2cbc847ed40ce311d65394e47f905';

  useEffect(() => {
    const searchForm = document.querySelector('.search-container');
    const cityInput = document.querySelector('#city') as HTMLInputElement;
    const searchIcon = document.querySelector('#city ~ img');
    const errorDisplay = document.querySelector('.error');

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

    async function sendQuery(query: string) {
      errorDisplay?.classList.remove('visible');

      const geocodeData = await fetchData(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`,
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

      const weatherData = await fetchData(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${geocodeData[0].lat}&lon=${geocodeData[0].lon}&units=${units}&appid=${API_KEY}`,
      ).catch((error) => {
        console.error(error);
      });

      updateSelectedDateData(weatherData);
    }

    sendQuery('london');

    return function cleanup() {
      searchForm?.removeEventListener('submit', formSubmit);
      searchIcon?.removeEventListener('click', submitQuery);
    };
  }, []);

  async function fetchData(apiURL: string) {
    const response = await fetch(apiURL);

    return await response?.json();
  }

  function getFiveDayForecast(weatherData: { list: []; city: object }) {
    const reducedList = weatherData.list.reduce(
      (weatherTimestamps: { dt_txt: string }[], currentTimestamp: { dt_txt: string }) => {
        const newDate = weatherTimestamps.every(
          (timestamp) => timestamp.dt_txt.split(' ')[0] !== currentTimestamp.dt_txt.split(' ')[0],
        );

        if (newDate) weatherTimestamps.push(currentTimestamp);

        return weatherTimestamps;
      },
      [],
    );

    return reducedList;
  }

  function updateSelectedDateData(weatherData: { list: []; city: { name: string; country: string } }) {
    // @ts-expect-error : Not sure how to fix error
    const forecast: Array<{
      weather: Array<{ description: string; icon: string }>;
      main: { temp: string; feels_like: string; temp_min: string; temp_max: string; humidity: string };
      pop: string;
      wind: { speed: string; deg: string };
    }> = getFiveDayForecast(weatherData);

    setSelectedDate({
      iconURL: `./src/imgs/weather-icons/${forecast[0].weather[0].icon}.svg`,
      description: forecast[0].weather[0].description,
      city: weatherData.city.name,
      country: weatherData.city.country,
      temp: Math.floor(parseFloat(forecast[0].main.temp)).toString(),
      feelsLike: Math.floor(parseFloat(forecast[0].main.feels_like)).toString(),
      tempMin: Math.floor(parseFloat(forecast[0].main.temp_min)).toString(),
      tempMax: Math.floor(parseFloat(forecast[0].main.temp_max)).toString(),
      tempUnit: 'F',
      precipitation: forecast[0].pop,
      humidity: forecast[0].main.humidity,
      wind: (Math.floor(parseFloat(forecast[0].wind.speed) * 10) / 10).toString(),
      windUnit: 'mph',
      windDeg: forecast[0].wind.deg,
    });

    setLoading(false);
  }

  return (
    <div className="App">
      <form className="search-container">
        <input type="text" name="city" id="city" placeholder="Enter City or Country" autoComplete="off" />
        <img src="./src/imgs/search.svg" alt="search" className="submit-btn" />
        <button type="submit"></button>
        <span className="error">Error!</span>
      </form>
      {!loading && <SelectedDateDisplay info={selectedDate as SelectedDateTemplate} />}
    </div>
  );
}

export default App;
