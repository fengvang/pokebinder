import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Filter from "./Filter";
import CardList from "./CardList";

function SearchResults() {
  const navigate = useNavigate();

  const [checkedTypes, setCheckedTypes] = useState({
    colorless: false,
    darkness: false,
    dragon: false,
    fairy: false,
    fighting: false,
    fire: false,
    grass: false,
    lightning: false,
    metal: false,
    psychic: false,
    water: false,
  });

  const goBack = () => {
    navigate("/");
  };

  return (
    <Container>
      <Row>
        <Col lg={2}>
          <Filter
            checkedTypes={checkedTypes}
            setCheckedTypes={setCheckedTypes}
          />
        </Col>
        <Col>
          <CardList checkedTypes={checkedTypes} />
        </Col>
      </Row>
      <Button className="button results-button" onClick={goBack}>
        Go back
      </Button>
    </Container>
  );
}

export default SearchResults;
