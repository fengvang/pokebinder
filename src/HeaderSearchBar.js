import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Col, Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function HeaderSearchBar() {
  const [pokemonName, setpokemonName] = useState("");
  const navigate = useNavigate();

  // set pokemon name
  const handleInputChange = (event) => {
    setpokemonName(event.target.value);
    localStorage.setItem("pokemonName", event.target.value);
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
    try {
      const response = await fetch("/search-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            name: pokemonName,
            subtype: "",
            page: 1,
            pageSize: 36,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }

      // store response
      const cardData = await response.json();

      // navigate to next page with results
      navigate(`/results?${pokemonName}&page=1`, {
        state: {
          cardData: cardData,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Col className="d-flex justify-content-center align-items-center">
        <Form
          style={{
            width: window.innerWidth < 768 ? "90%" : "50%",
            marginTop: window.innerWidth < 768 ? "-20px" : "auto",
          }}
        >
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search card by name"
              value={pokemonName}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="main-search-bar header-search-bar"
            />
            <Button
              style={{ zIndex: "9999" }}
              className="search-button"
              onClick={searchCard}
            >
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Form>
      </Col>
    </>
  );
}

export default HeaderSearchBar;
