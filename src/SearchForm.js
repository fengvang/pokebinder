import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Col,
  Row,
  Button,
  InputGroup,
  Spinner,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function SearchForm() {
  const [pokemonName, setpokemonName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
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
    if (!pokemonName.trim()) {
      setShowToast(true);
      return;
    }

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
                <h1>Searching for "{pokemonName}"</h1>
              )}
            </a>
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: "25px" }}>
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
      {/* for either, always render search bar */}
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

      <ToastContainer position="middle-center">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          autohide="true"
          delay="5000"
        >
          <Toast.Header closeButton={false} closeVariant="light">
            <strong className="mr-auto">Invalid search</strong>
          </Toast.Header>
          <Toast.Body>Please enter a valid Pokémon name or keyword.</Toast.Body>
        </Toast>
      </ToastContainer>

      {isLoading && location.pathname === "/" ? (
        <Row className="d-flex flex-column justify-content-center align-items-center">
          <Spinner
            animation="border"
            role="status"
            style={{ marginTop: "0px" }}
          />
          {pokemonName ? `Loading results for "${pokemonName}"` : null}
        </Row>
      ) : isLoading && location.pathname !== "/" ? (
        <Row className="d-flex flex-column justify-content-center align-items-center loading-div">
          <Spinner animation="border" role="status" />
          {pokemonName ? `Loading results for "${pokemonName}"` : null}
        </Row>
      ) : null}
    </Container>
  );
}

export default SearchForm;
