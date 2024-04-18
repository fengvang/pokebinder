import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import SearchForm from "./SearchForm";
import { useEffect } from "react";

function Home() {
  const location = useLocation();

  const rootPath = location.pathname === "/";

  useEffect(() => {
    if (location.pathname === "/") {
      console.log("Clearing local storage");
      localStorage.clear();
    }
  });

  return (
    <>
      <header>
        <Container className="header-container">
          <Link to="/">
            <span style={{ fontSize: "2rem" }}>PokéBinder</span>
          </Link>
          <Link to="/" className="login-header-button">
            <span>
              <i className="bi bi-person-circle"></i>{" "}
              <span style={{ fontSize: "1rem" }}>Login</span>
            </span>
          </Link>
        </Container>
      </header>
      {rootPath ? <SearchForm /> : null}
    </>
  );
}

export default Home;
