import Filter from "./Filter";
import CardList from "./CardList";
import { Container, Row, Col } from "react-bootstrap";

function SearchResults() {
  return (
    <Container>
      <Row>
        <Col className="filter" lg={2}>
          <Filter />
        </Col>
        <Col>
          <CardList />
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;
