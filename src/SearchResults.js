import { useState } from "react";
import MobileFilter from "./MobileFilter";
import Filter from "./Filter";
import CardList from "./CardList";
import { Container, Row, Col } from "react-bootstrap";

function SearchResults() {
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

  return (
    <Container>
      <Row>
        <MobileFilter
          checkedTypes={checkedTypes}
          setCheckedTypes={setCheckedTypes}
        />
        <Col className="filter" lg={2}>
          <Filter
            checkedTypes={checkedTypes}
            setCheckedTypes={setCheckedTypes}
          />
        </Col>
        <Col>
          <CardList checkedTypes={checkedTypes} />
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;
