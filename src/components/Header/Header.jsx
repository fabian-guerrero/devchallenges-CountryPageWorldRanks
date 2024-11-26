import { Link } from "react-router-dom";
import pageLogo from "../../assets/logo.svg";
import "./Header.css";

export default function Header() {
  return (
    <div className="header-wrapper">
      <Link to={"/"} className="home-link" aria-label="Go to Homepage">
        <img className="page-logo" src={pageLogo} alt="World Rank Logo" />
      </Link>
    </div>
  );
}
