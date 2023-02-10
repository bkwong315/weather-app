import { useEffect, useState } from 'react';

import SelectedDateTemplate from './interfaces/SelectedDateDisplay';
import SelectedDateDisplay from './components/SelectedDateDisplay/SelectedDateDisplay';
import './App.scss';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<SelectedDateTemplate>();

  useEffect(() => {
    const cityInput = document.querySelector('#city') as HTMLInputElement;
    const submitBtn = document.querySelector('#city ~ button');
    const units = 'imperial';
    const API_KEY = 'a8d2cbc847ed40ce311d65394e47f905';

    async function submitQuery() {
      const query = cityInput.value;
      const geocode = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`);
      const geocodeData = await geocode.json();
      const weather = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${geocodeData[0].lat}&lon=${geocodeData[0].lon}&units=${units}&appid=${API_KEY}`,
      );
      const weatherData = await weather.json();

      const filteredList = weatherData.list.reduce(
        (weatherTimestamps: { dt_txt: string }[], currentTimestamp: { dt_txt: string }) => {
          const newDate = weatherTimestamps.every(
            (timestamp) => timestamp.dt_txt.split(' ')[0] !== currentTimestamp.dt_txt.split(' ')[0],
          );

          if (newDate) weatherTimestamps.push(currentTimestamp);

          return weatherTimestamps;
        },
        [],
      );

      setLoading(false);

      try {
        await setSelectedDate({
          iconURL: `./src/imgs/weather-icons/${filteredList[0].weather[0].icon}.svg`,
          description: filteredList[0].weather[0].description,
          city: weatherData.city.name,
          country: weatherData.city.country,
          temp: Math.floor(filteredList[0].main.temp).toString(),
          feelsLike: Math.floor(filteredList[0].main.feels_like).toString(),
          tempMin: Math.floor(filteredList[0].main.temp_min).toString(),
          tempMax: Math.floor(filteredList[0].main.temp_max).toString(),
          tempUnit: 'F',
          precipitation: filteredList[0].pop,
          humidity: filteredList[0].main.humidity,
          wind: Math.floor(filteredList[0].wind.speed).toString(),
          windUnit: 'mph',
          windDeg: filteredList[0].wind.deg,
        });
      } catch (err) {
        console.error(err);
      }
    }

    submitBtn?.addEventListener('click', submitQuery);

    return () => submitBtn?.removeEventListener('click', submitQuery);
  }, []);

  return (
    <div className="App">
      <div className="input-container">
        <label htmlFor="city">City:</label>
        <input type="text" name="city" id="city" />
        <button>Submit</button>
      </div>
      {!loading && <SelectedDateDisplay info={selectedDate as SelectedDateTemplate} />}
    </div>
  );
}

export default App;
