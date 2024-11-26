import { Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/Header/Header";

import Home from "./pages/Home/Home";
import Country from "./pages/Country/Country";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="https://fabian-guerrero.github.io/devchallenges-CountryPageWorldRanks/"
          element={<Home />}
        />
        <Route
          path="https://fabian-guerrero.github.io/devchallenges-CountryPageWorldRanks/country/:countryCode"
          element={<Country />}
        />
      </Routes>
    </>
  );
}

export default App;
