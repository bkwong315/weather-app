interface WeatherData {
  dt: string;
  main: {
    temp: string;
    feels_like: string;
    temp_min: string;
    temp_max: string;
    pressure: string;
    sea_level: string;
    grnd_level: string;
    humidity: string;
    temp_kf: string;
  };
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    },
  ];
  clouds: {
    all: string;
  };
  wind: {
    speed: string;
    deg: string;
    gust: string;
  };
  visibility: string;
  pop: string;
  rain: {
    '3h': string;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export default WeatherData;
