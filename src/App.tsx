import { useEffect } from 'react';
import './App.scss';

function App() {
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

      console.log(weatherData);
      console.log(filteredList);
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
    </div>
  );
}

export default App;
