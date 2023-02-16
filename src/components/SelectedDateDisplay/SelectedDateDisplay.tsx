import SelectedDateTemplate from '../../interfaces/SelectedDateDisplay';
import './SelectedDateDisplay.scss';

function SelectedDateDisplay(props: { info: SelectedDateTemplate }) {
  const {
    iconURL,
    description,
    city,
    country,
    temp,
    feelsLike,
    tempMin,
    tempMax,
    tempUnit,
    rainfall,
    humidity,
    wind,
    windUnit,
    windDeg,
  } = props.info;

  function getSector(deg: number) {
    const sectors = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionalUnit = 45;

    return sectors[Math.floor(deg / directionalUnit)];
  }

  return (
    <div className="selected-date-container">
      <p className="description">{description}</p>
      <img src={iconURL} alt={description} className="weather-icon" />
      <p className="temperature">
        {temp}°{tempUnit}
      </p>
      <p className="location">
        {city}, {country}
      </p>
      <div className="additional-info">
        <div className="left-info">
          <div className="wind-wrapper info-wrapper">
            <p>Wind:</p>
            <p>
              {wind} {windUnit} {getSector(parseInt(windDeg))}
            </p>
          </div>
          <div className="precipitation-wrapper info-wrapper">
            <p>Rainfall:</p>
            <p>{rainfall}</p>
          </div>
          <div className="humidity-wrapper info-wrapper">
            <p>Humidity:</p>
            <p>{humidity}%</p>
          </div>
        </div>
        <div className="right-info">
          <div className="feels-like-wrapper info-wrapper">
            <p>Feels Like:</p>
            <p>
              {feelsLike}°{tempUnit}
            </p>
          </div>
          <div className="temp-max-wrapper info-wrapper">
            <p>High:</p>
            <p>
              {tempMax}°{tempUnit}
            </p>
          </div>
          <div className="temp-min-wrapper info-wrapper">
            <p>Low:</p>
            <p>
              {tempMin}°{tempUnit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedDateDisplay;
