import { useEffect, useState } from 'react';
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
    precipitation,
    humidity,
    wind,
    windUnit,
    windDeg,
  } = props.info;

  return (
    <div className="selected-date-container">
      <p className="description">{description}</p>
      <img src={iconURL} alt={description} className="weather-icon" />
      <p className="temperature">
        {temp}
        <sup>o</sup>
        {tempUnit}
      </p>
      <p className="location">
        {city}, {country}
      </p>
      <div className="additional-info">
        <div className="left-info">
          <div className="wind-wrapper">
            <p>Wind:</p>
            <p>
              {wind} {windUnit} {windDeg}
            </p>
          </div>
          <div className="precipitation-wrapper">
            <p>Precipitation:</p>
            <p>{precipitation}</p>
          </div>
          <div className="humidity-wrapper">
            <p>Humidity:</p>
            <p>{humidity}</p>
          </div>
        </div>
        <div className="right-info">
          <div className="feels-like-wrapper">
            <p>Feels Like:</p>
            <p>{feelsLike}</p>
          </div>
          <div className="temp-max-wrapper">
            <p>High:</p>
            <p>{tempMax}</p>
          </div>
          <div className="temp-min-wrapper">
            <p>Low:</p>
            <p>{tempMin}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedDateDisplay;
