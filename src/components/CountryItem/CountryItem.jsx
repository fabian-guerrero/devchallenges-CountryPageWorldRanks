import PropTypes from "prop-types";
import "./CountryItem.css";

import { formatNumber } from "../../utils/utils";

export default function CountryItem({ flag, name, population, area, region }) {
  return (
    <div data-component="country-item" className="result-item">
      <div className="flags">
        <img src={flag} alt={`Flag of ${name}`} />
      </div>
      <div className="names be-vietnam-pro-semibold-medium">{name}</div>
      <div className="population be-vietnam-pro-semibold-medium">
        {formatNumber(population)}
      </div>
      <div className="area be-vietnam-pro-semibold-medium">
        {formatNumber(area)}
      </div>
      <div className="region be-vietnam-pro-semibold-medium">{region}</div>
    </div>
  );
}

CountryItem.propTypes = {
  flag: PropTypes.string,
  name: PropTypes.string,
  population: PropTypes.number,
  area: PropTypes.number,
  region: PropTypes.string,
};
