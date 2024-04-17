import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Col,
  Row,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function SearchForm() {
  const [pokemonName, setpokemonName] = useState("");
  const [pokemonSubtype, setPokemonSubtype] = useState("");
  const [isLoading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // set pokemon name
  const handleInputChange = (event) => {
    setpokemonName(event.target.value);
    localStorage.setItem("pokemonName", event.target.value);
  };

  // set pokemon subtype (optional)
  const handlePokemonSubtypeChange = (event) => {
    setPokemonSubtype(event.target.value);
    localStorage.setItem("pokemonSubtype", event.target.value);
  };

  // event for enter key on keyboard
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchCard();
    }
  };

  // get card data for provided pokemon name and subtype if provided
  const searchCard = async () => {
    setLoading(true);
    try {
      const response = await fetch("/search-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            name: pokemonName,
            subtype: pokemonSubtype,
            page: 1,
            pageSize: 32,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }

      // store response
      const cardData = await response.json();

      const url = pokemonSubtype
        ? `/results?${pokemonName}&${pokemonSubtype}&page=1`
        : `/results?${pokemonName}&page=1`;

      if (pokemonSubtype === "") localStorage.setItem("pokemonSubtype", "All");

      // navigate to next page with results
      navigate(url, {
        state: {
          cardData: cardData,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const overflowHiddenWhenIsLoading = () => {
      document.body.style.overflow =
        isLoading && location.pathname !== "/" ? "hidden" : "auto";
    };

    overflowHiddenWhenIsLoading();
  }, [isLoading, location.pathname]);

  return (
    <Container>
      {/* if root header should be in middle of page; otherwise, render at top */}
      {location.pathname === "/" ? (
        <Row style={{ marginTop: "40vh" }}>
          <Col className="d-flex justify-content-center align-items-center">
            <a className="title-link" href="/">
              {pokemonName === "" ? (
                <h1>Search for Pokémon Card</h1>
              ) : (
                <h1>
                  Searching for "{pokemonName}
                  {`${pokemonSubtype}` !== "All" ? ` ${pokemonSubtype}` : ""}"
                </h1>
              )}
            </a>
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: "25px" }} id="title-row">
          <Col className="d-flex justify-content-center align-items-center">
            <a className="title-link" href="/">
              {pokemonName === "" ? (
                <h1>Search for Pokémon Card</h1>
              ) : (
                <h1>
                  Searching for "{pokemonName}
                  {`${pokemonSubtype}` !== "All" ? ` ${pokemonSubtype}` : ""}"
                </h1>
              )}
            </a>
          </Col>
        </Row>
      )}
      {/* for either, always render search bar */}
      <Row>
        <Col
          className="d-flex justify-content-center align-items-center"
          style={{ marginBottom: "20px" }}
        >
          <span id="caption-row">
            By Feng Vang with&nbsp;
            <a href="http://pokemontcg.io" target="_blank" rel="noreferrer">
              Pokémon TCG API
            </a>
          </span>
        </Col>
      </Row>
      <Row>
        <Col
          className="d-flex justify-content-center align-items-center"
          style={{ marginBottom: "25px" }}
        >
          <Form id="search-row">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search card by name"
                value={pokemonName}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="main-search-bar"
              />
              <Form.Select
                aria-label="Subtype dropdown"
                bsPrefix="subtype-select"
                value={pokemonSubtype}
                onChange={handlePokemonSubtypeChange}
                onKeyDown={handleKeyPress}
              >
                <option defaultValue="">Subtype</option>
                <option value="All">All</option>
                <option value="BREAK">BREAK</option>
                <option value="Baby">Baby</option>
                <option value="Basic">Basic</option>
                <option value="ex">ex</option>
                <option value="EX">EX</option>
                <option value="GX">GX</option>
                <option value='"Goldenrod Game Corner"'>
                  Goldenrod Game Corner
                </option>
                <option value="Item">Item</option>
                <option value="LEGEND">LEGEND</option>
                <option value="Level-Up">Level-Up</option>
                <option value="MEGA">MEGA</option>
                <option value='"Pokémon Tool"'>Pokémon Tool</option>
                <option value='"Pokémon Tool F"'>Pokémon Tool F</option>
                <option value='"Rapid Strike"'>Rapid Strike</option>
                <option value="Restored">Restored</option>
                <option value='"Rocket&apos;s Secret Machine"'>
                  Rocket's Secret Machine
                </option>
                <option value='"Single Strike"'>Single Strike</option>
                <option value="Special">Special</option>
                <option value="Stadium">Stadium</option>
                <option value='"Stage 1"'>Stage 1</option>
                <option value='"Stage 2"'>Stage 2</option>
                <option value="Supporter">Supporter</option>
                <option value='"TAG TEAM"'>TAG TEAM</option>
                <option value='"Technical Machine"'>Technical Machine</option>
                <option value="Tera">Tera</option>
                <option value="V">V</option>
                <option value="VMAX">VMAX</option>
              </Form.Select>
              <Button className="search-button" onClick={searchCard}>
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {isLoading && location.pathname === "/" ? (
        <Row className="d-flex flex-column justify-content-center align-items-center">
          <Spinner
            animation="border"
            role="status"
            style={{ marginTop: "0px" }}
          />
          {pokemonName
            ? `Loading results for "${pokemonName} ${
                pokemonSubtype !== "All" ? ` ${pokemonSubtype}` : ""
              }"`
            : null}
        </Row>
      ) : isLoading && location.pathname !== "/" ? (
        <Row className="d-flex flex-column justify-content-center align-items-center loading-div">
          <Spinner animation="border" role="status" />
          {pokemonName
            ? `Loading results for "${pokemonName} ${
                pokemonSubtype !== "All" ? ` ${pokemonSubtype}` : ""
              }"`
            : null}
        </Row>
      ) : null}
    </Container>
  );
}

export default SearchForm;
