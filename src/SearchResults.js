import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Filter from "./Filter";
import CardList from "./CardList";

function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();

  // set initial checked types to either false or to location state
  const initialCheckedTypes = location.state.filteredTypes || {
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
  };

  const [checkedTypes, setCheckedTypes] = useState(initialCheckedTypes);

  const [hpValue, setHpValue] = useState(0);

  const goBackOnePage = () => {
    navigate(-1);
  };

  useEffect(() => {
    const updatedCheckedTypes =
      location.state.filteredTypes || initialCheckedTypes;
    setCheckedTypes(updatedCheckedTypes);
  }, [location.state.filteredTypes]);

  console.log("From SearchResults:", checkedTypes);

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

          <Button className="button results-button" onClick={goBackOnePage}>
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
