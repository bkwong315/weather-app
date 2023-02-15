import WeatherData from './WeatherData';

interface ForecastResponse {
  cod: string;
  message: string;
  cnt: string;
  list: Array<WeatherData>;
  city: {
    id: string;
    name: string;
    coord: {
      lat: string;
      lon: string;
    };
    country: string;
    population: string;
    timezone: string;
    sunrise: string;
    sunset: string;
  };
}

export default ForecastResponse;
