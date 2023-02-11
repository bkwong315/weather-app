import ForecastListItem from './ForecastListItem';
import SelectedDateTemplate from '../../interfaces/SelectedDateDisplay';
import './ForecastList.scss';

function ForecastList<Type>(props: { forecastData: Array<Type> }) {
  const { forecastData } = props;
  let counter = 0;
  const forecastItems: Array<JSX.Element> = forecastData.map((data) => {
    return <ForecastListItem data={data as SelectedDateTemplate} key={counter++} />;
  });

  return <div className="forecast-container">{forecastItems}</div>;
}

export default ForecastList;
