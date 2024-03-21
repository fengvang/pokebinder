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

  const [hpValue, setHpValue] = useState(0);

  const goBack = () => {
    navigate("/");
  };

  return (
    <Container>
      <Row>
        <Col lg={3}>
          <Filter
            checkedTypes={checkedTypes}
            setCheckedTypes={setCheckedTypes}
            hpValue={hpValue}
            setHpValue={setHpValue}
          />
        </Col>
        <Col>
          <CardList checkedTypes={checkedTypes} hpValue={hpValue} />
        </Col>
      </Row>
      <Button className="button results-button" onClick={goBack}>
        Go back
      </Button>
    </Container>
  );
}

export default SearchResults;
