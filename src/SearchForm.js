import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  const [isLoading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setpokemonName(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchCard();
    }
  };

  const searchCard = async () => {
    setLoading(true);
    try {
      const response = await fetch("/search-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: pokemonName.toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const cardData = await response.json();

      navigate(`/results?${location.key}=${pokemonName}`, {
        state: { cardData: cardData },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center loading-div-root">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {location.pathname === "/" ? (
            <Row style={{ marginTop: "40vh" }}>
              <Col className="d-flex justify-content-center align-items-center">
                <a className="title-link" href="/">
                  {pokemonName === "" ? (
                    <h1>Search for Pokémon Card</h1>
                  ) : (
                    <h1>Searching for "{pokemonName}"</h1>
                  )}
                </a>
              </Col>
            </Row>
          ) : (
            <Row className="header" style={{ marginTop: "25px" }}>
              <Col className="d-flex justify-content-center align-items-center">
                <a className="title-link" href="/">
                  {pokemonName === "" ? (
                    <h1>Search for Pokémon Card</h1>
                  ) : (
                    <h1>Searching for "{pokemonName}"</h1>
                  )}
                </a>
              </Col>
            </Row>
          )}
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "20px" }}
            >
              By Feng Vang with&nbsp;
              <a href="http://pokemontcg.io" target="_blank" rel="noreferrer">
                Pokémon TCG API
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "25px" }}
            >
              <Form>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search card by name"
                    value={pokemonName}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                  />
                  <Button className="search-button" onClick={searchCard}>
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </>
      )}
      {isLoading && location.pathname !== "/" ? (
        <>
          <div className="d-flex justify-content-center align-items-center loading-div">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          <Row className="header" style={{ marginTop: "25px" }}>
            <Col className="d-flex justify-content-center align-items-center">
              <a className="title-link" href="/">
                {pokemonName === "" ? (
                  <h1>Search for Pokémon Card</h1>
                ) : (
                  <h1>Searching for "{pokemonName}"</h1>
                )}
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "20px" }}
            >
              By Feng Vang with&nbsp;
              <a href="http://pokemontcg.io" target="_blank" rel="noreferrer">
                Pokémon TCG API
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ marginBottom: "25px" }}
            >
              <Form>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search card by name"
                    value={pokemonName}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                  />
                  <Button className="search-button" onClick={searchCard}>
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </>
      ) : null}
    </Container>
  );
}

export default SearchForm;
