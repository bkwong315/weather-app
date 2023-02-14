import SelectedDateTemplate from '../../interfaces/SelectedDateDisplay';
import './ForecastListItem.scss';

function ForecastListItem(props: { data: SelectedDateTemplate }) {
  const { data } = props;
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="forecast-item">
      <header className="day">{weekDays[new Date(data.dt).getUTCDay()]}</header>
      <img src={data.iconURL} alt={data.description} className="weather-icon" />
      <p className="temp-high">
        High: {data.tempMax}°{data.tempUnit}
      </p>
      <p className="temp-low">
        Low: {data.tempMin}°{data.tempUnit}
      </p>
    </div>
  );
}

export default ForecastListItem;
