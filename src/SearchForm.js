import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

function SearchForm() {
  const [pokemonName, setpokemonName] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setpokemonName(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") searchCard();
  };

  const searchCard = async () => {
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

      navigate({
        pathname: `/results`,
        search: `?q=name:${pokemonName}`,
        state: { cardData: cardData },
      });

      console.log(navigate.pathname);
      console.log(navigate.search);
      console.log(navigate.state);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container fluid="sm">
      <Row>
        <Col className="d-flex justify-content-center align-items-center">
          <h1>Search for Pokemon Card</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={0} md={4}></Col>
        <Col xs={12} md={3}>
          <FloatingLabel controlId="floatingInput" label="Search card by name">
            <Form.Control
              type="text"
              placeholder="Search card by name"
              value={pokemonName}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </FloatingLabel>
        </Col>
        <Col
          md={1}
          className="d-flex justify-content-center align-items-center"
        >
          <Button className="search-button" onClick={searchCard}>
            Search
          </Button>
        </Col>
        <Col xs={0} md={4}></Col>
      </Row>
    </Container>
  );
}

export default SearchForm;
