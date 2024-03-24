import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Filter from "./Filter";
import CardList from "./CardList";

function SearchResults() {
  const navigate = useNavigate();

  const [checkedTypes, setCheckedTypes] = useState({
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
          <Button className="button results-button" onClick={goBack}>
            Go back
          </Button>
        </Col>
        <Col>
          <CardList checkedTypes={checkedTypes} hpValue={hpValue} />
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;
