import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./CountryDetail.css";

import { formatNumber } from "../../utils/utils";

export default function CountryDetail() {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        const countryData = data[0];
        setCountry(countryData);

        const borderCodes = countryData.borders || [];
        const borderPromises = borderCodes.map((code) =>
          fetch(`https://restcountries.com/v3.1/alpha/${code}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch border data");
              }
              return response.json();
            })
            .then((data) => data[0])
        );

        Promise.all(borderPromises)
          .then(setBorders)
          .catch((err) => setError(err.message));
      })

      .catch((error) => {
        setError(error.message);
      });
  }, [countryCode]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!country) {
    return (
      <div data-component="country-detail">
        <div className="details-wrapper-loader">
          <span className="country-flag placeholder-animation"></span>
          <span className="country-name placeholder-animation"></span>
          <span className="country-oficial-name placeholder-animation"></span>
          <div className="population-and-area">
            <div className="population-wrapper placeholder-animation"></div>
            <div className="area-wrapper placeholder-animation"></div>
          </div>
          <div className="detail-row">
            <span className="placeholder-text placeholder-animation"></span>
            <span className="placeholder-text placeholder-animation"></span>
          </div>
          <div className="detail-row">
            <span className="placeholder-text placeholder-animation"></span>
            <span className="placeholder-text placeholder-animation"></span>
          </div>
          <div className="detail-row">
            <span className="placeholder-text placeholder-animation"></span>
            <span className="placeholder-text placeholder-animation"></span>
          </div>
          <div className="detail-row">
            <span className="placeholder-text placeholder-animation"></span>
            <span className="placeholder-text placeholder-animation"></span>
          </div>
          <div className="detail-row">
            <span className="placeholder-text placeholder-animation"></span>
            <span className="placeholder-text placeholder-animation"></span>
          </div>
          <div className="detail-row-neighbouring">
            <span className="row-label placeholder-animation"></span>
            <div className="neighbouring-flags-wrapper">
              <span className="country-flag placeholder-animation"></span>
              <span className="country-flag placeholder-animation"></span>
              <span className="country-flag placeholder-animation"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const flag = country.flags.png;
  const name = country.name.common;
  const officialName = country.name.official;
  const population = country.population;
  const area = country.area;
  const capital = country.capital;
  const subRegion = country.subregion;
  let currencies;
  if (country.currencies) {
    currencies = Object.values(country.currencies)
      .map(({ name, symbol }) => `${name} (${symbol})`)
      .join(", ");
  } else {
    currencies = "No currencies availables";
  }
  let languages;
  if (country.languages) {
    languages = Object.values(country.languages).join(", ");
  } else {
    languages = "No languages availables";
  }
  const continents = Object.values(country.continents).join(", ");

  const handleNeighborClick = (neighborName) => {
    navigate(`/country/${neighborName}`);
  };

  return (
    <div data-component="country-detail">
      <div className="details-wrapper">
        <img className="country-flag" src={flag} alt={`Flag of ${name}`} />
        <p className="country-name be-vietnam-pro-semibold">{name}</p>
        <p className="country-oficial-name be-vietnam-pro-semibold-medium ">
          {officialName}
        </p>
        <div className="population-and-area">
          <div className="population-wrapper">
            <p className="pa-label">Population</p>
            {formatNumber(population)}
          </div>
          <div className="area-wrapper">
            <p className="pa-label">Area (km²)</p>
            {formatNumber(area)}
          </div>
        </div>
        <div>
          <div className="detail-row">
            <p className="row-label be-vietnam-pro-bold">Capital</p>
            <p className="be-vietnam-pro-bold">{capital}</p>
          </div>
          <div className="detail-row">
            <p className="row-label be-vietnam-pro-bold">Subregion</p>
            <p className="be-vietnam-pro-bold">{subRegion}</p>
          </div>
          <div className="detail-row">
            <p className="row-label be-vietnam-pro-bold">languages</p>
            <p className="be-vietnam-pro-bold">{languages}</p>
          </div>
          <div className="detail-row">
            <p className="row-label be-vietnam-pro-bold">Currencies</p>
            <p className="be-vietnam-pro-bold">{currencies}</p>
          </div>
          <div className="detail-row">
            <p className="row-label be-vietnam-pro-bold">Continents</p>
            <p className="be-vietnam-pro-bold">{continents}</p>
          </div>
          <div className="detail-row-neighbouring">
            <p className="row-label be-vietnam-pro-bold">
              Neighbouring Countries
            </p>
            {borders.length > 0 ? (
              <div className="neighbouring-flags-wrapper">
                {borders.map((border) => (
                  <div
                    className="country-flag"
                    key={border.cca3}
                    onClick={() => handleNeighborClick(border.ccn3)}
                  >
                    <div className="flag-wrapper">
                      <img
                        className="flag"
                        src={border.flags.png}
                        alt={`Flag of ${border.name.common}`}
                      />
                    </div>
                    <p className="flag-name be-vietnam-pro-bold-medium">
                      {border.name.common}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="be-vietnam-pro-bold">No bordering countries.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
