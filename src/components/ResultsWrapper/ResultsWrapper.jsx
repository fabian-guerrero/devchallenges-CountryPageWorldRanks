import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../../assets/search.svg";

import "./ResultsWrapper.css";
import CountryItem from "../CountryItem/CountryItem";
import CountryItemLoader from "../CountryItemLoader/CountryItemLoader";
import Paginator from "../Paginator/Paginator";

export default function ResultsWrapper() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("population");
  const [unMemberOnly, setUnMemberOnly] = useState(false);
  const [independentOnly, setIndependentOnly] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const regions = [
    "Americas",
    "Antarctic",
    "Africa",
    "Asia",
    "Europe",
    "Oceania",
  ];
  const resultsPerPage = 10;

  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,region,population,area,ccn3,altSpellings"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => (a.population || 0) - (b.population || 0)
        );
        setCountries(sortedData);
        setFilteredCountries(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    filterCountries(
      query,
      sortOption,
      unMemberOnly,
      independentOnly,
      selectedRegions
    );

    setCurrentPage(1);
  };

  const handleSort = (event) => {
    const option = event.target.value;
    setSortOption(option);

    filterCountries(
      searchQuery,
      option,
      unMemberOnly,
      independentOnly,
      selectedRegions
    );

    setCurrentPage(1);
  };

  const handleUnMemberFilter = () => {
    const newUnMemberOnly = !unMemberOnly;
    setUnMemberOnly(newUnMemberOnly);
    filterCountries(
      searchQuery,
      sortOption,
      newUnMemberOnly,
      independentOnly,
      selectedRegions
    );

    setCurrentPage(1);
  };

  const handleIndependentFilter = () => {
    const newIndependentOnly = !independentOnly;
    setIndependentOnly(newIndependentOnly);
    filterCountries(
      searchQuery,
      sortOption,
      unMemberOnly,
      newIndependentOnly,
      selectedRegions
    );

    setCurrentPage(1);
  };

  const handleRegionChange = (region) => {
    const updatedRegions = selectedRegions.includes(region)
      ? selectedRegions.filter((r) => r !== region)
      : [...selectedRegions, region];
    setSelectedRegions(updatedRegions);
    filterCountries(
      searchQuery,
      sortOption,
      unMemberOnly,
      independentOnly,
      updatedRegions
    );

    setCurrentPage(1);
  };

  const filterCountries = (
    query,
    sortOption,
    unMemberOnly,
    independentOnly,
    regions
  ) => {
    let filtered = countries;

    if (query) {
      filtered = filtered.filter((country) => {
        const name = country.name?.common?.toLowerCase() || "";
        const region = country.region?.toLowerCase() || "";
        const subregion = country.subregion?.toLowerCase() || "";

        return (
          name.includes(query) ||
          region.includes(query) ||
          subregion.includes(query)
        );
      });
    }

    if (regions.length > 0) {
      filtered = filtered.filter((country) => regions.includes(country.region));
    }

    if (unMemberOnly) {
      filtered = filtered.filter((country) => country.unMember);
    }

    if (independentOnly) {
      filtered = filtered.filter((country) => country.independent);
    }

    if (sortOption === "name") {
      filtered.sort((a, b) => {
        const nameA = a.name?.common?.toLowerCase() || "";
        const nameB = b.name?.common?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === "area") {
      filtered.sort((a, b) => (a.area || 0) - (b.area || 0));
    } else if (sortOption === "population") {
      filtered.sort((a, b) => (a.population || 0) - (b.population || 0));
    }

    setFilteredCountries(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCountries.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentCountries = filteredCountries.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div data-component="results-section-wrapper">
      <div className="search-wrapper">
        <p className="found-amount be-vietnam-pro-semibold-medium">
          Found {filteredCountries.length} Countries
        </p>
        <div className="input-wrapper">
          <img
            className="search-icon"
            src={searchIcon}
            alt="Search magnifying glass"
          />
          <input
            className="search-input"
            type="text"
            placeholder="Search by Name, Region, Subregion"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="results-filter-wrapper">
        <div className="filters">
          <div className="sort-wrapper">
            <p className="be-vietnam-pro-bold">Sort By</p>
            <select
              aria-label="Sort results"
              value={sortOption}
              onChange={handleSort}
            >
              <option value="">Select</option>
              <option value="name">Name (A-Z)</option>
              <option value="population">Population</option>
              <option value="area">Area</option>
            </select>
          </div>
          <div className="regions-selector-wrapper">
            <p className="be-vietnam-pro-bold">Region</p>
            <div className="regions-wrapper">
              {regions.map((region) => (
                <label className="region-name" key={region}>
                  <span className="region-label">{region}</span>
                  <input
                    type="checkbox"
                    value={region}
                    checked={selectedRegions.includes(region)}
                    onChange={() => handleRegionChange(region)}
                  />
                  <span className="selected-region"></span>
                </label>
              ))}
            </div>
          </div>
          <div className="status-selectors-wrapper">
            <p className="be-vietnam-pro-bold">Status</p>
            <div className="checkboxs-wrapper">
              <div className="status-wrapper">
                <label
                  htmlFor="MemberOfUN"
                  className="checkbox-label be-vietnam-pro-bold"
                >
                  <input
                    className="status-checkbox"
                    type="checkbox"
                    id="MemberOfUN"
                    name="MemberOfUN"
                    value="MemberOfUN"
                    checked={unMemberOnly}
                    onChange={handleUnMemberFilter}
                  />
                  <span className="checkmark"></span> Member of the United
                  Nations
                </label>
              </div>
              <div className="status-wrapper">
                <label
                  htmlFor="Independent"
                  className="checkbox-label be-vietnam-pro-bold"
                >
                  <input
                    className="status-checkbox"
                    type="checkbox"
                    id="Independent"
                    name="Independent"
                    value="Independent"
                    checked={independentOnly}
                    onChange={handleIndependentFilter}
                  />
                  <span className="checkmark"></span> Independent
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="results">
          <div className="results-grid-heading">
            <div className="flags be-vietnam-pro-bold ">Flag</div>
            <div className="names be-vietnam-pro-bold ">Name</div>
            <div className="population be-vietnam-pro-bold ">Population</div>
            <div className="area be-vietnam-pro-bold ">Area (km²)</div>
            <div className="region be-vietnam-pro-bold ">Region</div>
          </div>
          <div className="results-wrapper results-grid">
            {loading ? (
              <>
                <CountryItemLoader />
                <CountryItemLoader />
                <CountryItemLoader />
                <CountryItemLoader />
                <CountryItemLoader />
              </>
            ) : currentCountries.length > 0 ? (
              currentCountries.map((country) => (
                <Link
                  to={`/country/${country.ccn3}`}
                  key={country.altSpellings[0]}
                >
                  <CountryItem
                    flag={country.flags.png}
                    name={country.name.common}
                    population={country.population}
                    area={country.area}
                    region={country.region}
                  />
                </Link>
              ))
            ) : (
              <p>No countries found.</p>
            )}
          </div>
          {filteredCountries.length > resultsPerPage && (
            <Paginator
              currentPage={currentPage}
              totalItems={filteredCountries.length}
              itemsPerPage={resultsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
