import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row, Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function SearchForm() {
  const [pokemonName, setpokemonName] = useState("");
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
    try {
      const response = await fetch("/search-card", {
        method: "POST",
        headers: {
          "X-Api-Key": "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: pokemonName.toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const cardData = await response.json();

      navigate(`/results?${location.key}=${pokemonName}`, {
        state: {
          cardData: cardData,
          filteredTypes: {
            Colorless: false,
            Darkness: false,
            Dragon: false,
            Fairy: false,
            Fighting: false,
            Fire: false,
            Grass: false,
            Lightning: false,
            Metal: false,
            Psychic: false,
            Water: false,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const goBackOnePage = () => {
    window.history.go(-1);
  };

  return (
    <Container>
      <Row>
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
          {location.pathname !== "/" ? (
            <Button
              className="button results-button-mobile"
              onClick={goBackOnePage}
            >
              <i className="bi bi-backspace"></i>
            </Button>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchForm;
